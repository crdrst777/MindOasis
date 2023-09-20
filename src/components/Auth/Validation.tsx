import Proptypes from "prop-types";
import styled from "styled-components";

export default function Validations({ value }: any) {
  return <StyledValidations>{value}</StyledValidations>;
}

Validations.propTypes = {
  value: Proptypes.string.isRequired,
};

const StyledValidations = styled.div`
  font-size: 0.8rem;
  font-weight: 400;
  color: #e5503c;
  padding: 0.4rem 0;
`;
