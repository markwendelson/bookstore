let mix = require('laravel-mix');

// setting the public directory to public (this is where the mix-manifest.json gets created)
mix.setPublicPath('public')
// transpiling, babelling, minifying and creating the public/js/main.js out of our assets
    .js('vue/app.js', 'public/js')

mix.sass('resources/assets/sass/app.scss', 'public/css')

// aliases so instead of e.g. '../../components/test' we can import files like '@/components/test'
mix.webpackConfig({
    resolve: {
        alias: {
            "@": path.resolve(
                __dirname,
                "vue/js"
            ),
            "@sass": path.resolve(
                __dirname,
                "resources/assets/sass"
            ),
        }
    }
 });

 mix.version();