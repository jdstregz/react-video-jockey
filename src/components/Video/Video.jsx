import React from 'react';

const Video = ({src, onLoaded, hidden}) => {
    return (
        <video className={"example"} width={'100%'} autoPlay loop playsInline muted src={src}
            onLoadedData={onLoaded}
               style={{display: hidden ? "none" : "inherit"}}
        />
    )
};

export default Video;