import React from 'react'

const Wrapper = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='mx-auto max-w-7xl px-6'>{children}</div>
    )
}

export default Wrapper