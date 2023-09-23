import styled from "styled-components";
import tw from "twin.macro";
import { RingLoader } from "react-spinners";

const Container = styled.div`
    ${tw`w-screen h-screen z-[500] fixed bg-black bg-opacity-50 flex items-center justify-center`}
`

const Spinner = () => {

    return <Container>
        <RingLoader color="#4318FF" size={150} />
    </Container>
}

export default Spinner;