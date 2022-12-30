import {Box, Text} from "grommet";

export const Description = (props: { text: string }) => {
    return <Box pad={'16px'} round={'8px'} border={{ color: 'gray' }}>
        <Text size={'small'}>{props.text}</Text>
    </Box>
}
