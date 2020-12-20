use anyhow::{anyhow, Result};
use chrono::{Duration, Utc};
use lambda::{handler_fn, Context};
use log::{error, LevelFilter};
use rand::Rng;
use rusoto_core::Region;
use rusoto_signature::PostPolicy;
use serde_derive::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use simple_logger::SimpleLogger;
use std::collections::HashMap;
use std::env;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct CustomEvent {
    content_length: Option<u64>,
    content_type: Option<String>,
}

#[derive(Serialize, Debug, PartialEq)]
struct CustomOutput {
    message: String,
    url: String,
    policy: HashMap<String, String>,
}

const MOCK_KEY: &str = "AWS_MOCK_FLAG";
const BUCKET_NAME_KEY: &str = "BUCKET_NAME";
const LOCAL_KEY: &str = "LOCAL_FLAG";
const AWS_ACCESS_KEY_ID_KEY: &str = "AWS_ACCESS_KEY_ID";
const AWS_SECRET_ACCESS_KEY_KEY: &str = "AWS_SECRET_ACCESS_KEY";
const AWS_SESSION_TOKEN_KEY: &str = "AWS_SESSION_TOKEN";
const MAX_CONTENT_LENGTH: u64 = 1024 * 1024;

const MSG_CONTENT_LENGTH_TOO_LONG: &str = "Content-Length too long (max: 1.0MB).";
const MSG_WRONG_CONTENT_TYPE: &str = "Content-Type must start with image/ .";
const MSG_EMPTY_CONTENT_LENGTH: &str = "Content-Length is empty.";
const MSG_EMPTY_CONTENT_TYPE: &str = "Content-Type is empty.";

#[tokio::main]
async fn main() -> Result<()> {
    SimpleLogger::new()
        .with_level(LevelFilter::Debug)
        .init()
        .unwrap();
    lambda::run(handler_fn(geturl))
        .await
        // https://github.com/dtolnay/anyhow/issues/35
        .map_err(|err| anyhow!(err))?;
    Ok(())
}

async fn geturl(event: CustomEvent, c: Context) -> Result<CustomOutput> {
    if let None = event.content_length {
        error!("Empty Content-Length in request {}", c.request_id);
        return Err(anyhow!(get_err_msg(400, MSG_EMPTY_CONTENT_LENGTH)));
    }
    if let None = event.content_type {
        error!("Empty Content-Type in request {}", c.request_id);
        return Err(anyhow!(get_err_msg(400, MSG_EMPTY_CONTENT_TYPE)));
    }

    let content_length = event.content_length.unwrap();
    let content_type = event.content_type.unwrap();

    if content_length > MAX_CONTENT_LENGTH {
        error!("Content-Length is too long in request {}", c.request_id);
        return Err(anyhow!(get_err_msg(400, MSG_CONTENT_LENGTH_TOO_LONG)));
    }
    let ct_prefix = "image/";
    if !content_type.starts_with(ct_prefix) || !(content_type.len() > (ct_prefix.len() + 1)) {
        error!(
            "Content-Type doesn't start with 'image/' or subtype is empty in request {}",
            c.request_id
        );
        return Err(anyhow!(get_err_msg(400, MSG_WRONG_CONTENT_TYPE)));
    }

    let bucket_name = env::var(BUCKET_NAME_KEY)?;
    let file_name = generate_random_filename(&content_type)?;
    let (url, policy) = get_policy(&bucket_name, &file_name, content_length, &content_type).await?;

    Ok(CustomOutput {
        message: format!("Succeeded."),
        url,
        policy,
    })
}

async fn get_policy(
    bucket: &str,
    key: &str,
    content_length: u64,
    content_type: &str,
) -> Result<(String, HashMap<String, String>)> {
    let region;
    let mut access_key_id = "access-key-id".to_string();
    let mut secret_access_key = "secret-access-key".to_string();
    let mut session_token = "session-token".to_string();
    match env::var(MOCK_KEY) {
        Ok(_) => {
            // Unit Test
            region = Region::ApNortheast1;
        }
        Err(_) => {
            if env::var(LOCAL_KEY).unwrap() != "" {
                // local
                region = Region::Custom {
                    name: "ap-northeast-1".to_owned(),
                    endpoint: "http://localhost:8000".to_owned(),
                };
                access_key_id = "S3RVER".to_string();
                secret_access_key = "S3RVER".to_string();
            } else {
                // cloud
                region = Region::ApNortheast1;
                access_key_id = env::var(AWS_ACCESS_KEY_ID_KEY).unwrap();
                secret_access_key = env::var(AWS_SECRET_ACCESS_KEY_KEY).unwrap();
                session_token = env::var(AWS_SESSION_TOKEN_KEY).unwrap();
            }
        }
    }
    let expiration_date = Utc::now() + Duration::seconds(30);
    let policy = PostPolicy::default()
        .set_bucket_name(&bucket)
        .set_region(&region)
        .set_key(&key)
        .set_content_type(&content_type)
        .set_content_length_range(content_length, content_length)
        .set_expiration(&expiration_date)
        .set_access_key_id(&access_key_id)
        .set_secret_access_key(&secret_access_key)
        .set_session_token(&session_token)
        .build_form_data();
    Ok(policy.unwrap())
}

fn get_err_msg(code: u16, msg: &str) -> String {
    format!("[{}] {}", code, msg)
}

fn generate_random_filename(mime: &str) -> Result<String> {
    let mut rng = rand::thread_rng();

    let random_nums: u64 = rng.gen();

    let source = format!("{}", random_nums);
    let mut hasher = Sha256::new();
    hasher.update(source.as_bytes());
    let result = hasher.finalize()[..]
        .iter()
        .map(|n| format!("{:02X}", n))
        .collect::<String>()
        .to_lowercase();

    let extension = mime_guess::get_mime_extensions_str(mime);

    if let Some(ext) = extension {
        Ok(format!("{}.{}", result, ext[0]))
    } else {
        Err(anyhow!("malformed mime type: {}", mime))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn setup() {
        env::set_var(MOCK_KEY, "1");
        env::set_var(BUCKET_NAME_KEY, "test-bucket");
    }

    #[tokio::test]
    async fn test_geturl_handler_handle_valid_request() {
        setup();
        let event = CustomEvent {
            content_type: Some("image/png".to_string()),
            content_length: Some(1024 * 1024),
        };
        let result = geturl(event, Context::default())
            .await
            .expect("expected Ok(_) value");
        let key_list = [
            "key",
            "x-amz-credential",
            "x-amz-algorithm",
            "Content-Type",
            "x-amz-signature",
            "x-amz-security-token",
            "x-amz-date",
            "bucket",
            "policy",
        ];
        assert_eq!("Succeeded.", result.message);
        assert_eq!(
            "https://test-bucket.s3.ap-northeast-1.amazonaws.com",
            result.url
        );
        for &key in key_list.iter() {
            println!("check: {}", key);
            assert!(result.policy.contains_key(key));
        }
    }

    #[tokio::test]
    async fn test_geturl_handler_handle_empty_content_length() {
        setup();
        let event = CustomEvent {
            content_type: Some("image/png".to_string()),
            content_length: None,
        };
        let result = geturl(event, Context::default()).await;
        assert!(result.is_err());
        if let Err(error) = result {
            assert_eq!(
                error.to_string(),
                format!("[400] {}", MSG_EMPTY_CONTENT_LENGTH)
            )
        } else {
            // result must be Err
            panic!()
        }
    }

    #[tokio::test]
    async fn test_geturl_handler_handle_empty_content_type() {
        setup();
        let event = CustomEvent {
            content_type: None,
            content_length: Some(5000),
        };
        let result = geturl(event, Context::default()).await;
        assert!(result.is_err());
        if let Err(error) = result {
            assert_eq!(
                error.to_string(),
                format!("[400] {}", MSG_EMPTY_CONTENT_TYPE)
            )
        } else {
            // result must be Err
            panic!()
        }
    }

    #[tokio::test]
    async fn test_geturl_handler_handle_long_content_length() {
        setup();
        let event = CustomEvent {
            content_type: Some("image/png".to_string()),
            content_length: Some(1024 * 1024 + 1),
        };
        let result = geturl(event, Context::default()).await;
        assert!(result.is_err());
        if let Err(error) = result {
            assert_eq!(
                error.to_string(),
                format!("[400] {}", MSG_CONTENT_LENGTH_TOO_LONG)
            )
        } else {
            // result must be Err
            panic!()
        }
    }

    #[tokio::test]
    async fn test_geturl_handler_handle_wrong_content_type() {
        setup();
        let event = CustomEvent {
            content_type: Some("text/plain".to_string()),
            content_length: Some(1024 * 1024),
        };
        let result = geturl(event, Context::default()).await;
        assert!(result.is_err());
        if let Err(error) = result {
            assert_eq!(
                error.to_string(),
                format!("[400] {}", MSG_WRONG_CONTENT_TYPE)
            )
        } else {
            // result must be Err
            panic!()
        }
    }

    #[test]
    fn test_generate_random() {
        let mime_type = "image/png";
        let result = generate_random_filename(mime_type).unwrap();
        let result2 = generate_random_filename(mime_type).unwrap();
        assert!(result.contains("png"));
        assert_ne!(result, result2);
    }

    #[test]
    fn test_generate_random_with_malformed_mime() {
        let mime_type = "image/wrongimagetype";
        let result = generate_random_filename(mime_type);
        assert!(result.is_err());
    }
}
