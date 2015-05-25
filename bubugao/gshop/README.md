## Project Specs

### Docs

<http://10.200.51.181/svn/bbg-doc/手机端/云猴H5>

### 公用组件用法参考:

<http://10.200.51.142:8082/html/demo/>

### Page Framwork:

```html
<div class="page-view">
  <head>
    <!-- 头部 -->
  </head>
  <div class="page-view-body">
    <!-- 页面内容 -->
  </div>
  <footer>
    <!-- footer -->
  </footer>
</div>
```

### Module Unit

```html
<div class="mod-xxx">
  <div class="hd"></div>
  <div class="bd"></div>
  <div class="ft"></div>
</div>
```

## 本地布署Nginx配置

hosts:

127.0.0.1 s1.bbgstatic.com

```conf
# s1.bbgstatic.com.conf
server {
  listen 80;
  server_name s1.bbgstatic.com; 
  root /var/www/bbg/static5;
  access_log /var/log/nginx/s1.bbgstatic.log main;
  location / {
    autoindex on;
    default_type text/plain;
  }
  location /lib {
    proxy_pass http://10.200.51.142/lib;
    proxy_set_header Host s1.bbgstatic.com;
  }
  location ~* \.(eot|otf|ttf|woff)$ {
    add_header Access-Control-Allow-Methods GET;
    add_header Access-Control-Allow-Origin *;
  }
}

# gshop.conf
server {
  listen 8082;
  server_name  127.0.0.1 localhost; 
  root /var/www/bbg/static5/gshop;
  access_log /var/log/nginx/gshop.log main;
  location / {
    autoindex on;
    ssi on;
    index index.php;
    default_type text/plain;
  }
}
```

访问地址: <http://127.0.0.1:8082/html/demo/index.html>

## 联调环境配置

hosts:

10.200.51.142 s1.bbgstatic.com

<http://10.200.51.142:8082/html/>

## 代理服务

10.200.51.142:8080
