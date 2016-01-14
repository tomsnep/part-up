module.exports = {
    styleguide: {
        assets: {
            src: './styleguide/assets/**',
            dest: './dist/assets'
        },
        fonts: {
            src: '../app/public/fonts/**',
            dest: './dist/fonts'
        },
        components: {
            src: './styleguide',
            stripsSrc: './src/app/strip',
            stripsHtmlPrefix: 'cb-strip-'
        },
        html: {
            dest: './dist/',
            src: './styleguide/*.html'
        }
    },
    docstyles: {
        dest: './dist/css',
        src: './stylesheets/sg.scss',
    },
    partupstyles: {
        dest: './dist/css',
        src: [
            '../app/client/stylesheets/reset.css',
            '../app/client/stylesheets/main.scss'
        ]
    },
    swig: {
        // Swig options (gulp-swig api)
        options: {
            defaults: {
                cache: false,
                varControls: ['<%=', '%>'],
                tagControls: ['<%', '%>'],
                cmtControls: ['<#', '#>'],
                locals: {
                    cssBasePath: '/assets/css',
                    imgBasePath: '/assets/images',
                    jsBasePath: '/assets/js',
                    cssLegacyBasePath: '/style/css',
                    imgLegacyBasePath: '/images',
                }
            }
        }
    },
};
