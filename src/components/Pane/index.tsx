import styled from 'styled-components'

const Pane = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  padding: 16px;
`

export default Pane
