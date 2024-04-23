import React from 'react';
import { Box } from '@chakra-ui/react';
import swordLoader from '../assets/swordLoader.gif'

const Loader = () => {
    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            backgroundColor="rgba(0, 0, 0, 0.5)"
            zIndex="9999"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <img src={swordLoader} alt="Loading..." />
        </Box>
    );
};

export default Loader;
