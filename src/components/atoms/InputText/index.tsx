import { InputHTMLAttributes } from 'react';
import * as S from './styles';

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement>{
}

const InputText = ({children, ...props}: InputTextProps) => (
    <S.Input {...props}>
        {children}
    </S.Input>
)

export default InputText;