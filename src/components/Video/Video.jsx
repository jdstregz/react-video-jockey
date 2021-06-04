import React from 'react';

const Video = ({src}) => {
    return (
        <video className={"example"} width={'100%'} autoPlay loop playsInline muted src={src} />
    )
};

export default Video;