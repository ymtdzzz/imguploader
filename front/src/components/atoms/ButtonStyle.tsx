import { css } from 'styled-components'

const ButtonStyle = css`
  display: inline-block;
  background-color: #2F80ED;
  border-radius: 10px;
  padding: 0.1rem 0.2rem;
  color: white;
  transition: background-color 0.15s;
  &:hover {
  cursor: pointer;
  background-color: #5b9cf1;
  }
`

export default ButtonStyle
