import { extendTheme } from '@chakra-ui/react'

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const colors = {
    dark: {
        900: '#111827',
    },
}

const theme = extendTheme({ config, colors })

export default theme