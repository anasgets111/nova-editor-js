/* eslint-disable import/no-extraneous-dependencies */

const mix = require('laravel-mix');
const path = require('path');


require('./nova.mix');

mix.setPublicPath('dist')
    .js('resources/js/index.js', 'js/field.js')
    .vue({ version: 3 })
    .css('resources/css/field.css', 'css/field.css')
    .nova('advoor/nova-editor-js');
    
    mix.alias({
        'custom-functionality@': path.join(__dirname, './../../nova-components/CustomFunctionality/resources/js/'),
        '@': path.join(__dirname, '../../vendor/laravel/nova/resources/js/'),
    });