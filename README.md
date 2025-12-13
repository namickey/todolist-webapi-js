# todolist-webapi-js

TODO管理アプリケーション

- フロントは、javascriptによる画面制御
- バックエンドは、Spring-bootによる、JSON形式のWEBAPI

![画面イメージ](app.png)

## システム概要図

```mermaid
flowchart LR
  user["ユーザ<br/>(ブラウザ)"]

  %% ブラウザ内で動くクライアントをユーザノードの下に配置
  subgraph user
    subgraph client["クライアント (ブラウザ内で実行)"]
      ui["index.html<br/>UI表示"]
      js["app.js<br/>(fetchでAPI呼び出し)"]
    end
  end

　subgraph staticHost["静的配信(Spring Boot)"]
    staticSrv["/ (index.html, app.js)"]
  end
  subgraph apiHost["Web API(Spring Boot)"]
    api["TodoController<br/>/api/todos"]
    svc["TodoService"]
    mapper["TodoMapper + XML<br/>MyBatis"]
  end

  db[("H2 Database<br/>jdbc:h2:mem:testdb")]
  init["schema.sql<br/>(起動時DDL)"]

  user -->|HTTP GET /| staticSrv
  staticSrv --> ui
  staticSrv --> js
  ui -.->|操作| js
  js -->|"fetch /api/todos (JSON)"| api

  api --> svc --> mapper -->|SQL| db
  init -.-> db
```


## 実行 spring-boot:run

起動する
```
コマンドプロンプトで実行
mvnw.cmd spring-boot:run
```

## ブラウザアクセス
http://localhost:8080/  

