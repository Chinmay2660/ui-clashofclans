import React from 'react';
import { connect } from 'react-redux';
import { Box, useColorModeValue } from '@chakra-ui/react';

const Footer = (props) => {
    const bg = useColorModeValue('white', '#111827');

    return (
        <Box bg={bg} style={{ position: 'sticky', borderTop: '1px solid rgb(125 211 252)', padding: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            twst
        </Box>
    );
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
