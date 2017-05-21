(function(global)
{
    System.config({
        paths: {
            "npm:": "node_modules/"
        },
        map: {
            app: "app",
            '@angular/core': 'npm:@angular/core/bundles/core.umd.min.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.min.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.min.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.min.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js',
            "@angular/http": "npm:@angular/http/bundles/http.umd.js",
            "@angular/router": "npm:@angular/router/bundles/router.umd.js",
            "@angular/forms": "npm:@angular/forms/bundles/forms.umd.js",
            "rxjs": "npm:rxjs",
            "angular2-in-memory-web-api": "npm:angular2-in-memory-web-api",
            "angular2-router-loader": "npm:angular2-router-loader",
            "@swimlane/ngx-datatable": "npm:@swimlane/ngx-datatable/release/index.js"
        },
        packages: {
            app: {
                main: "./main.js",
                defaultExtension: "js"
            },
            rxjs: {
                defaultExtension: "js"
            }
        }
    });
})(this);
