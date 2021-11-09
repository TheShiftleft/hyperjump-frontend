import React from "react";
import styled from 'styled-components'
import Button from "../../../components/Button/Button";
import { useWalletModal } from "../../WalletModal";
import { Login } from "../../WalletModal/types";

interface Props {
  account?: string;
  login: Login;
  logout: () => void;
}

const UserButton = styled(Button)`
  margin-top: 3px;
  @media(max-width: 545px) {
    margin-top: 2px;
    font-size: 9px;
  }
`

const UserBlock: React.FC<Props> = ({ account, login, logout }) => {
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(login, logout, account);
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null;
  return (
    <div>
      {account ? (
        <UserButton
          scale="sm"
          variant="primary"
          onClick={() => {
            onPresentAccountModal();
          }}
        >
          {accountEllipsis}
        </UserButton>
      ) : (
        <UserButton
          scale="sm"
          onClick={() => {
            onPresentConnectModal();
          }}
        >
          Connect
        </UserButton>
      )}
    </div>
  );
};

export default React.memo(UserBlock, (prevProps, nextProps) => prevProps === nextProps);
