import type { ISourceOptions } from 'tsparticles-engine';

export const particleOptions: ISourceOptions = {
    fullScreen: {
        enable: true,
        zIndex: -1
    },
    background: {
        color: {
            value: '#FFCD6B',
        },
    },
    fpsLimit: 60,
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: 'attract',
            },
            resize: true,
        },
        modes: {
            attract: {
            },
        },
    },
    particles: {
        collisions: {
            enable: true,
        },
        move: {
            enable: true,
            outModes: {
                default: 'bounce',
            },
            random: true,
            speed: 1,
            straight: false,
        },
        number: {
            density: {
                enable: true,
                area: 800,
            },
            value: 100,
        },
        shape: {
            type: 'image',
            images: [{
                src: '/img/DuckMouthOpen.png',

            },{
                src: '/img/DuckMouthClose.png',
            }]
        },
        size: {
            value: 20,
        },
    },
    detectRetina: true,
};