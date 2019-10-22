import * as React from 'react'

interface HelloProps {
    compiler: string,
    framework: string
}

export const Hello = (props: HelloProps) => {
    console.log('Bingo')
    console.log()
    return <h1>Hola from {props.compiler} and {props.framework}!</h1>
}