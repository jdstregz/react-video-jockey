import action from '../assets/videos/action.mp4';
import dumbledore from '../assets/videos/dumbledore.mp4';

const videos = {
    a: action,
    b: dumbledore,
}

export const getVideo = (key) => {
    return videos[key];
}