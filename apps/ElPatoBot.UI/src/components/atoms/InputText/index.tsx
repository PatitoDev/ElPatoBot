import { InputHTMLAttributes } from 'react';
import * as S from './styles';

export type InputTextProps = InputHTMLAttributes<HTMLInputElement>

const InputText = ({children, ...props}: InputTextProps) => (
    <S.Input {...props}>
        {children}
    </S.Input>
);

export default InputText;