---
title: 默认模块
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"


---

# 默认模块

Base URLs:

# Authentication

# 登录注册

## POST register

POST /user/register

注册用户

> Body 请求参数

```json
{
  "username": "测试用户",
  "password": "123456",
  "email": "123456@gmail.com"
}
```

### 请求参数

| 名称       | 位置 | 类型   | 必选 | 说明 |
| ---------- | ---- | ------ | ---- | ---- |
| body       | body | object | 否   | none |
| » username | body | string | 是   | none |
| » password | body | string | 是   | none |
| » email    | body | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": null
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称   | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------ | ----------- | ---- | ---- | ------ | ---- |
| » code | integer     | true | none |        | none |
| » msg  | string      | true | none |        | none |
| » data | object¦null | true | none |        | none |

## POST login

POST /user/login

用户登录

> Body 请求参数

```json
{
  "username": "测试用户",
  "password": "123456"
}
```

### 请求参数

| 名称       | 位置 | 类型   | 必选 | 说明 |
| ---------- | ---- | ------ | ---- | ---- |
| body       | body | object | 是   | none |
| » username | body | string | 是   | none |
| » password | body | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "token": "123.456.789",
    "id": "1",
    "username": "测试用户",
    "email": "123456@gmail.com",
    "role": "USER"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称        | 类型    | 必选 | 约束 | 中文名 | 说明 |
| ----------- | ------- | ---- | ---- | ------ | ---- |
| » code      | integer | true | none |        | none |
| » msg       | string  | true | none |        | none |
| » data      | object  | true | none |        | none |
| »» token    | string  | true | none |        | none |
| »» id       | string  | true | none |        | none |
| »» username | string  | true | none |        | none |
| »» email    | string  | true | none |        | none |
| »» role     | string  | true | none |        | none |

## GET getUserInfo

GET /user/info

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "id": "1",
    "username": "测试用户",
    "email": "123456@gamil.com",
    "role": "USER"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称        | 类型    | 必选 | 约束 | 中文名 | 说明 |
| ----------- | ------- | ---- | ---- | ------ | ---- |
| » code      | integer | true | none |        | none |
| » msg       | string  | true | none |        | none |
| » data      | object  | true | none |        | none |
| »» id       | string  | true | none |        | none |
| »» username | string  | true | none |        | none |
| »» email    | string  | true | none |        | none |
| »» role     | string  | true | none |        | none |

# 登录注册/admin

## GET getAllUsersCount

GET /admin/user/count

获取总用户数量

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| Authorization | header | string | 否   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "usersCount": "string"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称          | 类型        | 必选 | 约束 | 中文名   | 说明 |
| ------------- | ----------- | ---- | ---- | -------- | ---- |
| » code        | integer     | true | none |          | none |
| » msg         | string      | true | none |          | none |
| » data        | object¦null | true | none |          | none |
| »» usersCount | string      | true | none | 总用户数 | none |

# 图书馆藏

## GET getBooks

GET /book

获取图书列表，查询参数中title，autor，isbn为非必需字段，其余为必需字段，后端记得判空并进行相应处理

### 请求参数

| 名称          | 位置   | 类型    | 必选 | 说明 |
| ------------- | ------ | ------- | ---- | ---- |
| currentPage   | query  | integer | 是   | none |
| pageSize      | query  | integer | 是   | none |
| title         | query  | string  | 否   | none |
| author        | query  | string  | 否   | none |
| isbn          | query  | string  | 否   | none |
| Authorization | header | string  | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "currentPage": 1,
    "pageSize": 21,
    "totalPage": 1,
    "totalCount": 21,
    "records": [
      {
        "id": "1",
        "title": "深入浅出Vue.js",
        "author": "刘博文",
        "isbn": "9787115509066",
        "publisher": "人民邮电出版社",
        "publishDate": "2019-03-01",
        "category": "计算机/编程",
        "coverUrl": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
        "description": "本书从Vue.js的源码入手，从根源上解决Vue.js的使用问题。",
        "totalStock": 5,
        "availableStock": 3,
        "location": "A-01-01",
        "averageRating": 4.8
      },
      {
        "id": "2",
        "title": "JavaScript高级程序设计",
        "author": "Matt Frisbie",
        "isbn": "9787115545381",
        "publisher": "人民邮电出版社",
        "publishDate": "2020-09-01",
        "category": "计算机/编程",
        "coverUrl": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80",
        "description": "本书是JavaScript开发者不可或缺的参考书。",
        "totalStock": 3,
        "availableStock": 0,
        "location": "A-01-02",
        "averageRating": 4.9
      },
      {
        "id": "3",
        "title": "三体",
        "author": "刘慈欣",
        "isbn": "9787536692930",
        "publisher": "重庆出版社",
        "publishDate": "2008-01-01",
        "category": "文学/科幻",
        "coverUrl": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80",
        "description": "文化大革命如火如荼进行的同时，军方探寻外星文明的绝秘计划“红岸工程”取得了突破性进展。",
        "totalStock": 10,
        "availableStock": 8,
        "location": "B-02-01",
        "averageRating": 5
      },
      {
        "id": "4",
        "title": "百年孤独",
        "author": "加西亚·马尔克斯",
        "isbn": "9787544253994",
        "publisher": "南海出版公司",
        "publishDate": "2011-06-01",
        "category": "文学/小说",
        "coverUrl": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        "description": "《百年孤独》是魔幻现实主义文学的代表作。",
        "totalStock": 8,
        "availableStock": 5,
        "location": "B-02-02",
        "averageRating": 4.7
      },
      {
        "id": "5",
        "title": "设计模式：可复用面向对象软件的基础",
        "author": "Erich Gamma",
        "isbn": "9787111075752",
        "publisher": "机械工业出版社",
        "publishDate": "2000-09-01",
        "category": "计算机/软件工程",
        "coverUrl": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
        "description": "本书结合设计实例从面向对象的设计中精选出23个设计模式。",
        "totalStock": 4,
        "availableStock": 2,
        "location": "A-03-01",
        "averageRating": 4.6
      },
      {
        "id": "6",
        "title": "活着",
        "author": "余华",
        "isbn": "9787506365437",
        "publisher": "作家出版社",
        "publishDate": "2012-08-01",
        "category": "文学/小说",
        "coverUrl": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80",
        "description": "讲述了农村人福贵悲惨的人生遭遇。",
        "totalStock": 12,
        "availableStock": 10,
        "location": "B-03-01",
        "averageRating": 4.9
      },
      {
        "id": "7",
        "title": "代码大全",
        "author": "Steve McConnell",
        "isbn": "9787121155914",
        "publisher": "电子工业出版社",
        "publishDate": "2011-12-01",
        "category": "计算机/软件工程",
        "coverUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        "description": "软件开发的百科全书。",
        "totalStock": 5,
        "availableStock": 4,
        "location": "A-04-01",
        "averageRating": 4.9
      },
      {
        "id": "8",
        "title": "人月神话",
        "author": "Frederick P. Brooks Jr.",
        "isbn": "9787302152686",
        "publisher": "清华大学出版社",
        "publishDate": "2007-09-01",
        "category": "计算机/软件工程",
        "coverUrl": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
        "description": "软件工程领域的圣经。",
        "totalStock": 6,
        "availableStock": 3,
        "location": "A-04-02",
        "averageRating": 4.5
      },
      {
        "id": "9",
        "title": "计算机网络：自顶向下方法",
        "author": "James F. Kurose",
        "isbn": "9787111599715",
        "publisher": "机械工业出版社",
        "publishDate": "2018-06-01",
        "category": "计算机/网络",
        "coverUrl": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
        "description": "最流行的计算机网络教材之一。",
        "totalStock": 15,
        "availableStock": 12,
        "location": "A-05-01",
        "averageRating": 4.7
      },
      {
        "id": "10",
        "title": "深度学习",
        "author": "Ian Goodfellow",
        "isbn": "9787115461476",
        "publisher": "人民邮电出版社",
        "publishDate": "2017-08-01",
        "category": "计算机/AI",
        "coverUrl": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
        "description": "AI领域的深蓝宝书。",
        "totalStock": 4,
        "availableStock": 1,
        "location": "A-05-02",
        "averageRating": 4.8
      },
      {
        "id": "11",
        "title": "算法导论",
        "author": "Thomas H. Cormen",
        "isbn": "9787111407010",
        "publisher": "机械工业出版社",
        "publishDate": "2013-01-01",
        "category": "计算机/算法",
        "coverUrl": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
        "description": "算法领域的标准教材。",
        "totalStock": 8,
        "availableStock": 6,
        "location": "A-06-01",
        "averageRating": 4.9
      },
      {
        "id": "12",
        "title": "红楼梦",
        "author": "曹雪芹",
        "isbn": "9787020002207",
        "publisher": "人民文学出版社",
        "publishDate": "1996-12-01",
        "category": "文学/经典",
        "coverUrl": "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=800&q=80",
        "description": "中国古典小说巅峰之作。",
        "totalStock": 20,
        "availableStock": 15,
        "location": "B-01-01",
        "averageRating": 5
      },
      {
        "id": "13",
        "title": "西游记",
        "author": "吴承恩",
        "isbn": "9787020008735",
        "publisher": "人民文学出版社",
        "publishDate": "1980-05-01",
        "category": "文学/经典",
        "coverUrl": "https://images.unsplash.com/photo-1610882648335-ced8fc8fa6b6?w=800&q=80",
        "description": "神魔小说的代表作。",
        "totalStock": 18,
        "availableStock": 10,
        "location": "B-01-02",
        "averageRating": 4.8
      },
      {
        "id": "14",
        "title": "围城",
        "author": "钱钟书",
        "isbn": "9787020024759",
        "publisher": "人民文学出版社",
        "publishDate": "1991-02-01",
        "category": "文学/小说",
        "coverUrl": "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&q=80",
        "description": "城外的人想冲进去，城里的人想逃出来。",
        "totalStock": 10,
        "availableStock": 7,
        "location": "B-04-01",
        "averageRating": 4.9
      },
      {
        "id": "15",
        "title": "平凡的世界",
        "author": "路遥",
        "isbn": "9787530219218",
        "publisher": "北京十月文艺出版社",
        "publishDate": "2019-06-01",
        "category": "文学/小说",
        "coverUrl": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
        "description": "展示了普通人在大时代历史进程中所走过的艰难曲折的道路。",
        "totalStock": 25,
        "availableStock": 5,
        "location": "B-04-02",
        "averageRating": 5
      },
      {
        "id": "16",
        "title": "解忧杂货店",
        "author": "东野圭吾",
        "isbn": "9787544270878",
        "publisher": "南海出版公司",
        "publishDate": "2014-05-01",
        "category": "文学/小说",
        "coverUrl": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80",
        "description": "现代人内心流失的东西，这家杂货店能帮你找回。",
        "totalStock": 30,
        "availableStock": 18,
        "location": "B-05-01",
        "averageRating": 4.6
      },
      {
        "id": "17",
        "title": "人类简史",
        "author": "尤瓦尔·赫拉利",
        "isbn": "9787508647357",
        "publisher": "中信出版社",
        "publishDate": "2014-11-01",
        "category": "历史/科普",
        "coverUrl": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
        "description": "从认知革命到科学革命，全方位回顾人类发展史。",
        "totalStock": 12,
        "availableStock": 8,
        "location": "C-01-01",
        "averageRating": 4.7
      },
      {
        "id": "18",
        "title": "明朝那些事儿",
        "author": "当年明月",
        "isbn": "9787505722460",
        "publisher": "中国友谊出版公司",
        "publishDate": "2006-09-01",
        "category": "历史/通俗",
        "coverUrl": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&q=80",
        "description": "历史原来可以这么写。",
        "totalStock": 20,
        "availableStock": 2,
        "location": "C-01-02",
        "averageRating": 4.9
      },
      {
        "id": "19",
        "title": "黑客与画家",
        "author": "Paul Graham",
        "isbn": "9787115249494",
        "publisher": "人民邮电出版社",
        "publishDate": "2011-04-01",
        "category": "计算机/随笔",
        "coverUrl": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80",
        "description": "硅谷创业教父的文集。",
        "totalStock": 7,
        "availableStock": 6,
        "location": "A-07-01",
        "averageRating": 4.5
      },
      {
        "id": "20",
        "title": "重构",
        "author": "Martin Fowler",
        "isbn": "9787115508649",
        "publisher": "人民邮电出版社",
        "publishDate": "2019-04-01",
        "category": "计算机/软件工程",
        "coverUrl": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80",
        "description": "改善既有代码设计的经典。",
        "totalStock": 6,
        "availableStock": 4,
        "location": "A-07-02",
        "averageRating": 4.9
      },
      {
        "id": "21",
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "isbn": "9787115216878",
        "publisher": "人民邮电出版社",
        "publishDate": "2010-01-01",
        "category": "计算机/编程",
        "coverUrl": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
        "description": "代码整洁之道。",
        "totalStock": 9,
        "availableStock": 7,
        "location": "A-08-01",
        "averageRating": 4.8
      }
    ]
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称               | 类型     | 必选 | 约束 | 中文名 | 说明 |
| ------------------ | -------- | ---- | ---- | ------ | ---- |
| » code             | integer  | true | none |        | none |
| » msg              | string   | true | none |        | none |
| » data             | object   | true | none |        | none |
| »» currentPage     | integer  | true | none |        | none |
| »» pageSize        | integer  | true | none |        | none |
| »» totalPage       | integer  | true | none |        | none |
| »» totalCount      | integer  | true | none |        | none |
| »» records         | [object] | true | none |        | none |
| »»» id             | string   | true | none |        | none |
| »»» title          | string   | true | none |        | none |
| »»» author         | string   | true | none |        | none |
| »»» category       | string   | true | none |        | none |
| »»» coverUrl       | string   | true | none |        | none |
| »»» totalStock     | integer  | true | none |        | none |
| »»» availableStock | integer  | true | none |        | none |

## GET getBookById

GET /book/{bookId}

根据图书ID获取图书详细信息

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| bookId        | path   | string | 是   | none |
| Authorization | header | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "id": "66",
    "title": "书",
    "author": "无名作者",
    "isbn": "978-1-4454-5859-5",
    "publisher": "某个出版社",
    "publishDate": "2025-03-05",
    "category": "通俗小说",
    "description": "这是一本书",
    "coverUrl": "https://homely-hippodrome.info/",
    "totalStock": 59,
    "availableStock": 46,
    "averageRating": 5
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称              | 类型    | 必选 | 约束 | 中文名 | 说明 |
| ----------------- | ------- | ---- | ---- | ------ | ---- |
| » code            | integer | true | none |        | none |
| » msg             | string  | true | none |        | none |
| » data            | object  | true | none |        | none |
| »» id             | string  | true | none |        | none |
| »» title          | string  | true | none |        | none |
| »» author         | string  | true | none |        | none |
| »» isbn           | string  | true | none |        | none |
| »» publisher      | string  | true | none |        | none |
| »» publishDate    | string  | true | none |        | none |
| »» category       | string  | true | none |        | none |
| »» description    | string  | true | none |        | none |
| »» coverUrl       | string  | true | none |        | none |
| »» totalStock     | integer | true | none |        | none |
| »» availableStock | integer | true | none |        | none |
| »» averageRating  | number  | true | none |        | none |

## GET getTop10Books

GET /book/get/top10

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| Authorization | header | string | 否   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "top10Books": [
      {
        "id": "string",
        "title": "string",
        "author": "string",
        "category": "string",
        "coverUrl": "string",
        "totalStock": 0,
        "availableStock": 0
      }
    ]
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称               | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------------------ | ----------- | ---- | ---- | ------ | ---- |
| » code             | integer     | true | none |        | none |
| » msg              | string      | true | none |        | none |
| » data             | object¦null | true | none |        | none |
| »» top10Books      | [object]    | true | none |        | none |
| »»» id             | string      | true | none |        | none |
| »»» title          | string      | true | none |        | none |
| »»» author         | string      | true | none |        | none |
| »»» category       | string      | true | none |        | none |
| »»» coverUrl       | string      | true | none |        | none |
| »»» totalStock     | integer     | true | none |        | none |
| »»» availableStock | integer     | true | none |        | none |

# 图书馆藏/admin

## POST createBook

POST /admin/book

创建图书

> Body 请求参数

```json
{
  "title": "红楼梦",
  "author": "曹雪芹",
  "isbn": "978-1-4895-7777-1",
  "publisher": "中国人民出版社",
  "publishDate": "2001-10-14",
  "category": "通俗小说",
  "description": "这是红楼梦",
  "coverUrl": "https://negligible-validity.net/",
  "totalStock": 10
}
```

### 请求参数

| 名称          | 位置   | 类型    | 必选 | 说明 |
| ------------- | ------ | ------- | ---- | ---- |
| Authorization | header | string  | 是   | none |
| body          | body   | object  | 是   | none |
| » title       | body   | string  | 是   | none |
| » author      | body   | string  | 是   | none |
| » isbn        | body   | string  | 是   | none |
| » publisher   | body   | string  | 是   | none |
| » publishDate | body   | string  | 是   | none |
| » category    | body   | string  | 是   | none |
| » description | body   | string  | 是   | none |
| » coverUrl    | body   | string  | 是   | none |
| » totalStock  | body   | integer | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "id": "20",
    "title": "红楼梦",
    "author": "曹雪芹",
    "isbn": "978-1-4895-7777-1",
    "publisher": "中国人名出版社",
    "publishDate": "2001-10-14",
    "category": "通俗小说",
    "description": "这是红楼梦",
    "coverUrl": "https://negligible-validity.net/",
    "totalStock": 10,
    "availableStock": 7,
    "averageRating": 5
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称              | 类型    | 必选 | 约束 | 中文名 | 说明 |
| ----------------- | ------- | ---- | ---- | ------ | ---- |
| » code            | integer | true | none |        | none |
| » msg             | string  | true | none |        | none |
| » data            | object  | true | none |        | none |
| »» id             | string  | true | none |        | none |
| »» title          | string  | true | none |        | none |
| »» author         | string  | true | none |        | none |
| »» isbn           | string  | true | none |        | none |
| »» publisher      | string  | true | none |        | none |
| »» publishDate    | string  | true | none |        | none |
| »» category       | string  | true | none |        | none |
| »» description    | string  | true | none |        | none |
| »» coverUrl       | string  | true | none |        | none |
| »» totalStock     | integer | true | none |        | none |
| »» availableStock | integer | true | none |        | none |
| »» averageRating  | number  | true | none |        | none |

## DELETE deleteBooksById

DELETE /admin/book

根据图书ID批量删除图书，可单删，也可批量删
注意：不是直接从数据库中删除，而是逻辑删除，即将is_deleted字段设为1

> Body 请求参数

```json
{
  "bookIdList": [
    "74",
    "24"
  ]
}
```

### 请求参数

| 名称          | 位置   | 类型     | 必选 | 说明 |
| ------------- | ------ | -------- | ---- | ---- |
| Authorization | header | string   | 是   | none |
| body          | body   | object   | 是   | none |
| » bookIdList  | body   | [string] | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": null
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称   | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------ | ----------- | ---- | ---- | ------ | ---- |
| » code | integer     | true | none |        | none |
| » msg  | string      | true | none |        | none |
| » data | object¦null | true | none |        | none |

## PUT updateBookById

PUT /admin/book/{bookId}

更新图书信息

> Body 请求参数

```json
{
  "title": "三体",
  "author": "刘慈欣",
  "isbn": "978-1-372-13693-1",
  "publisher": "某出版社",
  "publishDate": "2025-06-18",
  "category": "tempor deserunt laborum",
  "description": "好看",
  "coverUrl": "https://lean-cemetery.biz/",
  "totalStock": 43
}
```

### 请求参数

| 名称          | 位置   | 类型    | 必选 | 说明 |
| ------------- | ------ | ------- | ---- | ---- |
| bookId        | path   | string  | 是   | none |
| Authorization | header | string  | 是   | none |
| body          | body   | object  | 是   | none |
| » title       | body   | string  | 是   | none |
| » author      | body   | string  | 是   | none |
| » isbn        | body   | string  | 是   | none |
| » publisher   | body   | string  | 是   | none |
| » publishDate | body   | string  | 是   | none |
| » category    | body   | string  | 是   | none |
| » description | body   | string  | 是   | none |
| » coverUrl    | body   | string  | 是   | none |
| » totalStock  | body   | integer | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "id": "63",
    "title": "三体",
    "author": "刘慈欣",
    "isbn": "978-1-372-13693-1",
    "publisher": "某出版社",
    "publishDate": "2025-06-18",
    "category": "tempor deserunt laborum",
    "description": "好看",
    "coverUrl": "https://lean-cemetery.biz/",
    "totalStock": 43,
    "availableStock": 42,
    "averageRating": 5
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称              | 类型    | 必选 | 约束 | 中文名 | 说明 |
| ----------------- | ------- | ---- | ---- | ------ | ---- |
| » code            | integer | true | none |        | none |
| » msg             | string  | true | none |        | none |
| » data            | object  | true | none |        | none |
| »» id             | string  | true | none |        | none |
| »» title          | string  | true | none |        | none |
| »» author         | string  | true | none |        | none |
| »» isbn           | string  | true | none |        | none |
| »» publisher      | string  | true | none |        | none |
| »» publishDate    | string  | true | none |        | none |
| »» category       | string  | true | none |        | none |
| »» description    | string  | true | none |        | none |
| »» coverUrl       | string  | true | none |        | none |
| »» totalStock     | integer | true | none |        | none |
| »» availableStock | integer | true | none |        | none |
| »» averageRating  | number  | true | none |        | none |

## GET getAllBooksCount

GET /admin/book/count

获取总藏书量

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| Authorization | header | string | 否   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "booksCount": "string"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称          | 类型        | 必选 | 约束 | 中文名   | 说明 |
| ------------- | ----------- | ---- | ---- | -------- | ---- |
| » code        | integer     | true | none |          | none |
| » msg         | string      | true | none |          | none |
| » data        | object¦null | true | none |          | none |
| »» booksCount | string      | true | none | 总藏书量 | none |

# 借阅归还

## POST borrowBookById

POST /borrow

根据图书ID借阅书籍，同时需要附带借阅时长

> Body 请求参数

```json
{
  "bookId": "53",
  "borrowTime": 30
}
```

### 请求参数

| 名称          | 位置   | 类型    | 必选 | 说明 |
| ------------- | ------ | ------- | ---- | ---- |
| Authorization | header | string  | 是   | none |
| body          | body   | object  | 是   | none |
| » bookId      | body   | string  | 是   | none |
| » borrowTime  | body   | integer | 是   | none |

#### 枚举值

| 属性         | 值   |
| ------------ | ---- |
| » borrowTime | 1    |
| » borrowTime | 3    |
| » borrowTime | 7    |
| » borrowTime | 14   |
| » borrowTime | 30   |
| » borrowTime | 60   |
| » borrowTime | 90   |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "id": "54",
    "bookId": "53",
    "bookTitle": "三体",
    "bookCoverUrl": "https://bare-signature.net/",
    "borrowDate": "2025-01-23",
    "dueDate": "2025-09-13",
    "returnDate": "2025-11-11",
    "status": "OVERDUE"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称            | 类型        | 必选 | 约束 | 中文名 | 说明 |
| --------------- | ----------- | ---- | ---- | ------ | ---- |
| » code          | integer     | true | none |        | none |
| » msg           | string      | true | none |        | none |
| » data          | object      | true | none |        | none |
| »» id           | string      | true | none |        | none |
| »» bookId       | string      | true | none |        | none |
| »» bookTitle    | string      | true | none |        | none |
| »» bookCoverUrl | string      | true | none |        | none |
| »» borrowDate   | string      | true | none |        | none |
| »» dueDate      | string      | true | none |        | none |
| »» returnDate   | string¦null | true | none |        | none |
| »» status       | string      | true | none |        | none |

#### 枚举值

| 属性   | 值       |
| ------ | -------- |
| status | BORROWED |
| status | RETURNED |
| status | OVERDUE  |

## POST returnBookById

POST /borrow/return

根据借阅记录ID归还图书

> Body 请求参数

```json
{
  "borrowRecordId": "31"
}
```

### 请求参数

| 名称             | 位置   | 类型   | 必选 | 说明 |
| ---------------- | ------ | ------ | ---- | ---- |
| Authorization    | header | string | 是   | none |
| body             | body   | object | 是   | none |
| » borrowRecordId | body   | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "id": "65",
    "bookId": "51",
    "bookTitle": "三体",
    "bookCoverUrl": "https://subdued-pearl.com/",
    "borrowDate": "2025-10-19",
    "dueDate": "2025-11-26",
    "returnDate": "2025-11-20",
    "status": "RETURNED"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称            | 类型        | 必选 | 约束 | 中文名 | 说明 |
| --------------- | ----------- | ---- | ---- | ------ | ---- |
| » code          | integer     | true | none |        | none |
| » msg           | string      | true | none |        | none |
| » data          | object¦null | true | none |        | none |
| »» id           | string      | true | none |        | none |
| »» bookId       | string      | true | none |        | none |
| »» bookTitle    | string      | true | none |        | none |
| »» bookCoverUrl | string      | true | none |        | none |
| »» borrowDate   | string      | true | none |        | none |
| »» dueDate      | string      | true | none |        | none |
| »» returnDate   | string¦null | true | none |        | none |
| »» status       | string      | true | none |        | none |

#### 枚举值

| 属性   | 值       |
| ------ | -------- |
| status | BORROWED |
| status | RETURNED |
| status | OVERDUE  |

## GET getCurrentBorrowRecords

GET /borrow/me

获取用户的当前借阅，即排除掉status为RETURNED的数据

### 请求参数

| 名称          | 位置   | 类型    | 必选 | 说明 |
| ------------- | ------ | ------- | ---- | ---- |
| currentPage   | query  | integer | 是   | none |
| pageSize      | query  | integer | 是   | none |
| Authorization | header | string  | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPage": 1,
    "totalCount": 1,
    "records": [
      {
        "id": "20",
        "bookId": "98",
        "bookTitle": "三国演义",
        "bookCoverUrl": "https://sophisticated-husband.org/",
        "borrowDate": "2026-05-17",
        "dueDate": "2025-04-14",
        "returnDate": "2025-11-27",
        "status": "BORROWED"
      },
      {
        "id": "66",
        "bookId": "85",
        "bookTitle": "红楼梦",
        "bookCoverUrl": "https://stunning-translation.org/",
        "borrowDate": "2025-05-18",
        "dueDate": "2025-01-12",
        "returnDate": "2025-11-14",
        "status": "OVERDUE"
      },
      {
        "id": "69",
        "bookId": "23",
        "bookTitle": "西游记",
        "bookCoverUrl": "https://lasting-advertisement.biz/",
        "borrowDate": "2025-01-17",
        "dueDate": "2025-09-07",
        "returnDate": "2025-02-15",
        "status": "BORROWED"
      }
    ]
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称             | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ---------------- | ----------- | ---- | ---- | ------ | ---- |
| » code           | integer     | true | none |        | none |
| » msg            | string      | true | none |        | none |
| » data           | object¦null | true | none |        | none |
| »» currentPage   | integer     | true | none |        | none |
| »» pageSize      | integer     | true | none |        | none |
| »» totalPage     | integer     | true | none |        | none |
| »» totalCount    | integer     | true | none |        | none |
| »» records       | [object]    | true | none |        | none |
| »»» id           | string      | true | none |        | none |
| »»» bookId       | string      | true | none |        | none |
| »»» bookTitle    | string      | true | none |        | none |
| »»» bookCoverUrl | string      | true | none |        | none |
| »»» borrowDate   | string      | true | none |        | none |
| »»» dueDate      | string      | true | none |        | none |
| »»» returnDate   | string¦null | true | none |        | none |
| »»» status       | string      | true | none |        | none |

#### 枚举值

| 属性   | 值       |
| ------ | -------- |
| status | BORROWED |
| status | RETURNED |
| status | OVERDUE  |

## GET getHistoryBorrowRecords

GET /borrow/history

获取历史借阅记录，即返回status为RETURNED的借阅记录

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| currentPage   | query  | string | 是   | none |
| pageSize      | query  | string | 是   | none |
| Authorization | header | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPage": 1,
    "totalCount": 1,
    "records": [
      {
        "id": "79",
        "bookId": "86",
        "bookTitle": "三体",
        "bookCoverUrl": "https://squiggly-tenant.net/",
        "borrowDate": "2026-06-10",
        "dueDate": "2025-12-19",
        "returnDate": "2025-02-24",
        "status": "RETURNED"
      }
    ]
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称             | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ---------------- | ----------- | ---- | ---- | ------ | ---- |
| » code           | integer     | true | none |        | none |
| » msg            | string      | true | none |        | none |
| » data           | object¦null | true | none |        | none |
| »» currentPage   | integer     | true | none |        | none |
| »» pageSize      | integer     | true | none |        | none |
| »» totalPage     | integer     | true | none |        | none |
| »» totalCount    | integer     | true | none |        | none |
| »» records       | [object]    | true | none |        | none |
| »»» id           | string      | true | none |        | none |
| »»» bookId       | string      | true | none |        | none |
| »»» bookTitle    | string      | true | none |        | none |
| »»» bookCoverUrl | string      | true | none |        | none |
| »»» borrowDate   | string      | true | none |        | none |
| »»» dueDate      | string      | true | none |        | none |
| »»» returnDate   | string¦null | true | none |        | none |
| »»» status       | string      | true | none |        | none |

#### 枚举值

| 属性   | 值       |
| ------ | -------- |
| status | BORROWED |
| status | RETURNED |
| status | OVERDUE  |

## DELETE deleteHistoryRecords

DELETE /borrow/history

批量删除历史借阅记录，既可以删除单个也可以删除多个
注意：只能删除status为RETURNED状态的记录，后端注意判断

> Body 请求参数

```json
{
  "borrowRecordIdList": [
    "60",
    "37",
    "18"
  ]
}
```

### 请求参数

| 名称                 | 位置   | 类型     | 必选 | 说明 |
| -------------------- | ------ | -------- | ---- | ---- |
| Authorization        | header | string   | 是   | none |
| body                 | body   | object   | 是   | none |
| » borrowRecordIdList | body   | [string] | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": null
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称   | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------ | ----------- | ---- | ---- | ------ | ---- |
| » code | integer     | true | none |        | none |
| » msg  | string      | true | none |        | none |
| » data | object¦null | true | none |        | none |

# 借阅归还/admin

## GET getAllBorrowRecords

GET /admin/borrow

获取所有借阅信息，分页返回
可根据书名查询
书名可传可不传

### 请求参数

| 名称          | 位置   | 类型    | 必选 | 说明 |
| ------------- | ------ | ------- | ---- | ---- |
| currentPage   | query  | integer | 是   | none |
| pageSize      | query  | integer | 是   | none |
| bookTitle     | query  | string  | 否   | none |
| Authorization | header | string  | 否   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPage": 1,
    "totalCount": 1,
    "records": [
      {}
    ]
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称           | 类型        | 必选 | 约束 | 中文名 | 说明 |
| -------------- | ----------- | ---- | ---- | ------ | ---- |
| » code         | integer     | true | none |        | none |
| » msg          | string      | true | none |        | none |
| » data         | object¦null | true | none |        | none |
| »» currentPage | integer     | true | none |        | none |
| »» pageSize    | integer     | true | none |        | none |
| »» totalPage   | integer     | true | none |        | none |
| »» totalCount  | integer     | true | none |        | none |
| »» records     | [object]    | true | none |        | none |

## GET getAllRecordsCount

GET /admin/borrow/count

获取总借阅量，即数据库中借阅记录表总条数

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| Authorization | header | string | 否   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称   | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------ | ----------- | ---- | ---- | ------ | ---- |
| » code | integer     | true | none |        | none |
| » msg  | string      | true | none |        | none |
| » data | object¦null | true | none |        | none |

## GET getOverdueRate

GET /admin/borrow/overdue-rate

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| Authorization | header | string | 否   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "overdueRate": "string"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称           | 类型        | 必选 | 约束 | 中文名 | 说明 |
| -------------- | ----------- | ---- | ---- | ------ | ---- |
| » code         | integer     | true | none |        | none |
| » msg          | string      | true | none |        | none |
| » data         | object¦null | true | none |        | none |
| »» overdueRate | string      | true | none |        | none |

## GET getReturnedRate

GET /admin/borrow/returned-rate

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| Authorization | header | string | 否   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "returnedRate": "string"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称            | 类型        | 必选 | 约束 | 中文名 | 说明 |
| --------------- | ----------- | ---- | ---- | ------ | ---- |
| » code          | integer     | true | none |        | none |
| » msg           | string      | true | none |        | none |
| » data          | object¦null | true | none |        | none |
| »» returnedRate | string      | true | none |        | none |

# 通知管理

## GET getNotifications

GET /notification/me

获取用户的所有通知

### 请求参数

| 名称          | 位置   | 类型    | 必选 | 说明 |
| ------------- | ------ | ------- | ---- | ---- |
| currentPage   | query  | integer | 是   | none |
| pageSize      | query  | integer | 是   | none |
| Authorization | header | string  | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPage": 1,
    "totalCount": 1,
    "records": [
      {
        "id": "5",
        "title": "通知1",
        "content": "est",
        "type": "DUE_REMINDER",
        "status": "UNREAD",
        "gmtCreate": "incididunt veniam esse elit aliqua"
      },
      {
        "id": "2",
        "title": "通知2",
        "content": "est in qui aliqua",
        "type": "DUE_REMINDER",
        "status": "READ",
        "gmtCreate": "dolore consectetur dolor amet"
      }
    ]
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称           | 类型        | 必选 | 约束 | 中文名 | 说明 |
| -------------- | ----------- | ---- | ---- | ------ | ---- |
| » code         | integer     | true | none |        | none |
| » msg          | string      | true | none |        | none |
| » data         | object¦null | true | none |        | none |
| »» currentPage | integer     | true | none |        | none |
| »» pageSize    | integer     | true | none |        | none |
| »» totalPage   | integer     | true | none |        | none |
| »» totalCount  | integer     | true | none |        | none |
| »» records     | [object]    | true | none |        | none |
| »»» id         | string      | true | none |        | none |
| »»» title      | string      | true | none |        | none |
| »»» content    | string      | true | none |        | none |
| »»» type       | string      | true | none |        | none |
| »»» status     | string      | true | none |        | none |
| »»» gmtCreate  | string      | true | none |        | none |

#### 枚举值

| 属性   | 值                    |
| ------ | --------------------- |
| type   | DUE_REMINDER          |
| type   | RESERVATION_AVAILABLE |
| type   | OVERDUE_NOTICE        |
| status | UNREAD                |
| status | READ                  |

## GET getUnreadCount

GET /notification/unread-count

获取未读消息总数

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| Authorization | header | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "count": "5"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称     | 类型        | 必选 | 约束 | 中文名 | 说明 |
| -------- | ----------- | ---- | ---- | ------ | ---- |
| » code   | integer     | true | none |        | none |
| » msg    | string      | true | none |        | none |
| » data   | object¦null | true | none |        | none |
| »» count | string      | true | none |        | none |

## PUT readNotifications

PUT /notification/read

批量设置已读通知

> Body 请求参数

```json
{
  "notificationIdList": [
    "7",
    "2"
  ]
}
```

### 请求参数

| 名称                 | 位置   | 类型     | 必选 | 说明 |
| -------------------- | ------ | -------- | ---- | ---- |
| Authorization        | header | string   | 否   | none |
| body                 | body   | object   | 是   | none |
| » notificationIdList | body   | [string] | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": null
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称   | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------ | ----------- | ---- | ---- | ------ | ---- |
| » code | integer     | true | none |        | none |
| » msg  | string      | true | none |        | none |
| » data | object¦null | true | none |        | none |

# 通知管理/admin

## POST pushNotification2All

POST /admin/notification/push-all

推送通知给所有用户

> Body 请求参数

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "title": "string",
    "content": "string",
    "type": "COMMON",
    "status": "UNREAD"
  }
}
```

### 请求参数

| 名称       | 位置 | 类型        | 必选 | 说明 |
| ---------- | ---- | ----------- | ---- | ---- |
| body       | body | object      | 是   | none |
| » code     | body | integer     | 是   | none |
| » msg      | body | string      | 是   | none |
| » data     | body | object¦null | 是   | none |
| »» title   | body | string      | 是   | none |
| »» content | body | string      | 是   | none |
| »» type    | body | string      | 是   | none |
| »» status  | body | string      | 是   | none |

#### 枚举值

| 属性      | 值             |
| --------- | -------------- |
| »» type   | COMMON         |
| »» type   | DUE_REMINDER   |
| »» type   | OVERDUE_NOTICE |
| »» status | UNREAD         |
| »» status | READ           |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称   | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------ | ----------- | ---- | ---- | ------ | ---- |
| » code | integer     | true | none |        | none |
| » msg  | string      | true | none |        | none |
| » data | object¦null | true | none |        | none |

## POST pushNotification2User

POST /admin/notification/push/{userName}

推送通知给指定的用户，必须给出完整且正确的用户名才能指定推送，不能模糊，错误返回1003

> Body 请求参数

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "title": "string",
    "content": "string",
    "type": "COMMON",
    "status": "UNREAD"
  }
}
```

### 请求参数

| 名称          | 位置   | 类型        | 必选 | 说明   |
| ------------- | ------ | ----------- | ---- | ------ |
| userName      | path   | string      | 是   | 用户名 |
| Authorization | header | string      | 否   | none   |
| body          | body   | object      | 是   | none   |
| » code        | body   | integer     | 是   | none   |
| » msg         | body   | string      | 是   | none   |
| » data        | body   | object¦null | 是   | none   |
| »» title      | body   | string      | 是   | none   |
| »» content    | body   | string      | 是   | none   |
| »» type       | body   | string      | 是   | none   |
| »» status     | body   | string      | 是   | none   |

#### 枚举值

| 属性      | 值             |
| --------- | -------------- |
| »» type   | COMMON         |
| »» type   | DUE_REMINDER   |
| »» type   | OVERDUE_NOTICE |
| »» status | UNREAD         |
| »» status | READ           |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {}
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称   | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------ | ----------- | ---- | ---- | ------ | ---- |
| » code | integer     | true | none |        | none |
| » msg  | string      | true | none |        | none |
| » data | object¦null | true | none |        | none |

# 评价打分

## POST createReview

POST /review

创建评价，注意评分为小数，最小为0.5，最大为5

> Body 请求参数

```json
{
  "bookId": "56",
  "rating": 5,
  "comment": "很好的一本书"
}
```

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| Authorization | header | string | 是   | none |
| body          | body   | object | 是   | none |
| » bookId      | body   | string | 是   | none |
| » rating      | body   | number | 是   | none |
| » comment     | body   | string | 是   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "id": "24",
    "bookId": "3",
    "userId": "66",
    "username": "测试用户",
    "rating": 5,
    "comment": "很好的一本书",
    "gmtCreate": "2025-11-20"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称         | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------------ | ----------- | ---- | ---- | ------ | ---- |
| » code       | integer     | true | none |        | none |
| » msg        | string      | true | none |        | none |
| » data       | object¦null | true | none |        | none |
| »» id        | string      | true | none |        | none |
| »» bookId    | string      | true | none |        | none |
| »» userId    | string      | true | none |        | none |
| »» username  | string      | true | none |        | none |
| »» rating    | number      | true | none |        | none |
| »» comment   | string      | true | none |        | none |
| »» gmtCreate | string      | true | none |        | none |

## DELETE deleteReview

DELETE /review/{reviewId}

逻辑删除某条评论，只能删除自己的评论，不是自己的不要展示删除的按钮，并且也不能删除

### 请求参数

| 名称          | 位置   | 类型   | 必选 | 说明 |
| ------------- | ------ | ------ | ---- | ---- |
| reviewId      | path   | string | 是   | none |
| Authorization | header | string | 否   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": null
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称   | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------ | ----------- | ---- | ---- | ------ | ---- |
| » code | integer     | true | none |        | none |
| » msg  | string      | true | none |        | none |
| » data | object¦null | true | none |        | none |

## GET getReviewsByBookId

GET /review/{bookId}

根据图书ID获取该书的评价列表

### 请求参数

| 名称          | 位置   | 类型    | 必选 | 说明 |
| ------------- | ------ | ------- | ---- | ---- |
| bookId        | path   | string  | 是   | none |
| currentPage   | query  | integer | 是   | none |
| pageSize      | query  | integer | 是   | none |
| Authorization | header | string  | 否   | none |

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPage": 1,
    "totalCount": 1,
    "records": [
      {
        "id": "16",
        "bookId": "63",
        "userId": "45",
        "username": "度梓玥",
        "rating": 55,
        "comment": "cillum ut ea deserunt",
        "gmtCreate": "sint ad"
      },
      {
        "id": "40",
        "bookId": "74",
        "userId": "17",
        "username": "上官国华",
        "rating": 21,
        "comment": "commodo cillum eiusmod ut consequat",
        "gmtCreate": "et ut amet"
      },
      {
        "id": "15",
        "bookId": "92",
        "userId": "76",
        "username": "用梓馨",
        "rating": 86,
        "comment": "magna qui",
        "gmtCreate": "aliqua nisi"
      }
    ]
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | none | Inline   |

### 返回数据结构

状态码 **200**

| 名称           | 类型        | 必选 | 约束 | 中文名 | 说明 |
| -------------- | ----------- | ---- | ---- | ------ | ---- |
| » code         | integer     | true | none |        | none |
| » msg          | string      | true | none |        | none |
| » data         | object¦null | true | none |        | none |
| »» currentPage | integer     | true | none |        | none |
| »» pageSize    | integer     | true | none |        | none |
| »» totalPage   | integer     | true | none |        | none |
| »» totalCount  | integer     | true | none |        | none |
| »» records     | [object]    | true | none |        | none |
| »»» id         | string      | true | none |        | none |
| »»» bookId     | string      | true | none |        | none |
| »»» userId     | string      | true | none |        | none |
| »»» username   | string      | true | none |        | none |
| »»» rating     | number      | true | none |        | none |
| »»» comment    | string      | true | none |        | none |
| »»» gmtCreate  | string      | true | none |        | none |

# 数据模型

<h2 id="tocS_ApiResponse">ApiResponse</h2>

<a id="schemaapiresponse"></a>
<a id="schema_ApiResponse"></a>
<a id="tocSapiresponse"></a>
<a id="tocsapiresponse"></a>

```json
{
  "code": 200,
  "msg": "请求成功",
  "data": {}
}

```

### 属性

| 名称 | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ---- | ----------- | ---- | ---- | ------ | ---- |
| code | integer     | true | none |        | none |
| msg  | string      | true | none |        | none |
| data | object¦null | true | none |        | none |

<h2 id="tocS_PageResponse">PageResponse</h2>

<a id="schemapageresponse"></a>
<a id="schema_PageResponse"></a>
<a id="tocSpageresponse"></a>
<a id="tocspageresponse"></a>

```json
{
  "currentPage": 1,
  "pageSize": 10,
  "totalPage": 1,
  "totalCount": 1,
  "records": [
    {}
  ]
}

```

### 属性

| 名称        | 类型     | 必选 | 约束 | 中文名 | 说明 |
| ----------- | -------- | ---- | ---- | ------ | ---- |
| currentPage | integer  | true | none |        | none |
| pageSize    | integer  | true | none |        | none |
| totalPage   | integer  | true | none |        | none |
| totalCount  | integer  | true | none |        | none |
| records     | [object] | true | none |        | none |

<h2 id="tocS_UserRegisterDTO">UserRegisterDTO</h2>

<a id="schemauserregisterdto"></a>
<a id="schema_UserRegisterDTO"></a>
<a id="tocSuserregisterdto"></a>
<a id="tocsuserregisterdto"></a>

```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}

```

### 属性

| 名称     | 类型   | 必选 | 约束 | 中文名 | 说明 |
| -------- | ------ | ---- | ---- | ------ | ---- |
| username | string | true | none |        | none |
| password | string | true | none |        | none |
| email    | string | true | none |        | none |

<h2 id="tocS_UserLoginDTO">UserLoginDTO</h2>

<a id="schemauserlogindto"></a>
<a id="schema_UserLoginDTO"></a>
<a id="tocSuserlogindto"></a>
<a id="tocsuserlogindto"></a>

```json
{
  "username": "string",
  "password": "string"
}

```

### 属性

| 名称     | 类型   | 必选 | 约束 | 中文名 | 说明 |
| -------- | ------ | ---- | ---- | ------ | ---- |
| username | string | true | none |        | none |
| password | string | true | none |        | none |

<h2 id="tocS_UserVO">UserVO</h2>

<a id="schemauservo"></a>
<a id="schema_UserVO"></a>
<a id="tocSuservo"></a>
<a id="tocsuservo"></a>

```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "string"
}

```

### 属性

| 名称     | 类型   | 必选 | 约束 | 中文名 | 说明 |
| -------- | ------ | ---- | ---- | ------ | ---- |
| id       | string | true | none |        | none |
| username | string | true | none |        | none |
| email    | string | true | none |        | none |
| role     | string | true | none |        | none |

<h2 id="tocS_LoginVO">LoginVO</h2>

<a id="schemaloginvo"></a>
<a id="schema_LoginVO"></a>
<a id="tocSloginvo"></a>
<a id="tocsloginvo"></a>

```json
{
  "token": "string",
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "string"
}

```

### 属性

| 名称     | 类型   | 必选 | 约束 | 中文名 | 说明 |
| -------- | ------ | ---- | ---- | ------ | ---- |
| token    | string | true | none |        | none |
| id       | string | true | none |        | none |
| username | string | true | none |        | none |
| email    | string | true | none |        | none |
| role     | string | true | none |        | none |

<h2 id="tocS_BookCreateDTO">BookCreateDTO</h2>

<a id="schemabookcreatedto"></a>
<a id="schema_BookCreateDTO"></a>
<a id="tocSbookcreatedto"></a>
<a id="tocsbookcreatedto"></a>

```json
{
  "title": "string",
  "author": "string",
  "isbn": "string",
  "publisher": "string",
  "publishDate": "string",
  "category": "string",
  "description": "string",
  "coverUrl": "string",
  "totalStock": 0
}

```

### 属性

| 名称        | 类型    | 必选 | 约束 | 中文名 | 说明 |
| ----------- | ------- | ---- | ---- | ------ | ---- |
| title       | string  | true | none |        | none |
| author      | string  | true | none |        | none |
| isbn        | string  | true | none |        | none |
| publisher   | string  | true | none |        | none |
| publishDate | string  | true | none |        | none |
| category    | string  | true | none |        | none |
| description | string  | true | none |        | none |
| coverUrl    | string  | true | none |        | none |
| totalStock  | integer | true | none |        | none |

<h2 id="tocS_BookUpdateDTO">BookUpdateDTO</h2>

<a id="schemabookupdatedto"></a>
<a id="schema_BookUpdateDTO"></a>
<a id="tocSbookupdatedto"></a>
<a id="tocsbookupdatedto"></a>

```json
{
  "title": "string",
  "author": "string",
  "isbn": "string",
  "publisher": "string",
  "publishDate": "string",
  "category": "string",
  "description": "string",
  "coverUrl": "string",
  "totalStock": 0
}

```

### 属性

| 名称        | 类型    | 必选 | 约束 | 中文名 | 说明 |
| ----------- | ------- | ---- | ---- | ------ | ---- |
| title       | string  | true | none |        | none |
| author      | string  | true | none |        | none |
| isbn        | string  | true | none |        | none |
| publisher   | string  | true | none |        | none |
| publishDate | string  | true | none |        | none |
| category    | string  | true | none |        | none |
| description | string  | true | none |        | none |
| coverUrl    | string  | true | none |        | none |
| totalStock  | integer | true | none |        | none |

<h2 id="tocS_BookBriefVO">BookBriefVO</h2>

<a id="schemabookbriefvo"></a>
<a id="schema_BookBriefVO"></a>
<a id="tocSbookbriefvo"></a>
<a id="tocsbookbriefvo"></a>

```json
{
  "id": "string",
  "title": "string",
  "author": "string",
  "category": "string",
  "coverUrl": "string",
  "totalStock": 0,
  "availableStock": 0
}

```

### 属性

| 名称           | 类型    | 必选 | 约束 | 中文名 | 说明 |
| -------------- | ------- | ---- | ---- | ------ | ---- |
| id             | string  | true | none |        | none |
| title          | string  | true | none |        | none |
| author         | string  | true | none |        | none |
| category       | string  | true | none |        | none |
| coverUrl       | string  | true | none |        | none |
| totalStock     | integer | true | none |        | none |
| availableStock | integer | true | none |        | none |

<h2 id="tocS_BookDetailVO">BookDetailVO</h2>

<a id="schemabookdetailvo"></a>
<a id="schema_BookDetailVO"></a>
<a id="tocSbookdetailvo"></a>
<a id="tocsbookdetailvo"></a>

```json
{
  "id": "string",
  "title": "string",
  "author": "string",
  "isbn": "string",
  "publisher": "string",
  "publishDate": "string",
  "category": "string",
  "description": "string",
  "coverUrl": "string",
  "totalStock": 0,
  "availableStock": 0,
  "averageRating": 0
}

```

### 属性

| 名称           | 类型    | 必选 | 约束 | 中文名 | 说明 |
| -------------- | ------- | ---- | ---- | ------ | ---- |
| id             | string  | true | none |        | none |
| title          | string  | true | none |        | none |
| author         | string  | true | none |        | none |
| isbn           | string  | true | none |        | none |
| publisher      | string  | true | none |        | none |
| publishDate    | string  | true | none |        | none |
| category       | string  | true | none |        | none |
| description    | string  | true | none |        | none |
| coverUrl       | string  | true | none |        | none |
| totalStock     | integer | true | none |        | none |
| availableStock | integer | true | none |        | none |
| averageRating  | number  | true | none |        | none |

<h2 id="tocS_BorrowRequestDTO">BorrowRequestDTO</h2>

<a id="schemaborrowrequestdto"></a>
<a id="schema_BorrowRequestDTO"></a>
<a id="tocSborrowrequestdto"></a>
<a id="tocsborrowrequestdto"></a>

```json
{
  "bookId": "string",
  "borrowTime": 1
}

```

### 属性

| 名称       | 类型    | 必选 | 约束 | 中文名 | 说明 |
| ---------- | ------- | ---- | ---- | ------ | ---- |
| bookId     | string  | true | none |        | none |
| borrowTime | integer | true | none |        | none |

#### 枚举值

| 属性       | 值   |
| ---------- | ---- |
| borrowTime | 1    |
| borrowTime | 3    |
| borrowTime | 7    |
| borrowTime | 14   |
| borrowTime | 30   |
| borrowTime | 60   |
| borrowTime | 90   |

<h2 id="tocS_ReturnRequestDTO">ReturnRequestDTO</h2>

<a id="schemareturnrequestdto"></a>
<a id="schema_ReturnRequestDTO"></a>
<a id="tocSreturnrequestdto"></a>
<a id="tocsreturnrequestdto"></a>

```json
{
  "borrowRecordId": "string"
}

```

### 属性

| 名称           | 类型   | 必选 | 约束 | 中文名 | 说明 |
| -------------- | ------ | ---- | ---- | ------ | ---- |
| borrowRecordId | string | true | none |        | none |

<h2 id="tocS_BorrowRecordVO">BorrowRecordVO</h2>

<a id="schemaborrowrecordvo"></a>
<a id="schema_BorrowRecordVO"></a>
<a id="tocSborrowrecordvo"></a>
<a id="tocsborrowrecordvo"></a>

```json
{
  "id": "string",
  "bookId": "string",
  "bookTitle": "string",
  "bookCoverUrl": "string",
  "borrowDate": "string",
  "dueDate": "string",
  "returnDate": "string",
  "status": "BORROWED"
}

```

### 属性

| 名称         | 类型        | 必选 | 约束 | 中文名 | 说明 |
| ------------ | ----------- | ---- | ---- | ------ | ---- |
| id           | string      | true | none |        | none |
| bookId       | string      | true | none |        | none |
| bookTitle    | string      | true | none |        | none |
| bookCoverUrl | string      | true | none |        | none |
| borrowDate   | string      | true | none |        | none |
| dueDate      | string      | true | none |        | none |
| returnDate   | string¦null | true | none |        | none |
| status       | string      | true | none |        | none |

#### 枚举值

| 属性   | 值       |
| ------ | -------- |
| status | BORROWED |
| status | RETURNED |
| status | OVERDUE  |

<h2 id="tocS_ReservationRequestDTO">ReservationRequestDTO</h2>

<a id="schemareservationrequestdto"></a>
<a id="schema_ReservationRequestDTO"></a>
<a id="tocSreservationrequestdto"></a>
<a id="tocsreservationrequestdto"></a>

```json
{
  "bookId": "string"
}

```

### 属性

| 名称   | 类型   | 必选 | 约束 | 中文名 | 说明 |
| ------ | ------ | ---- | ---- | ------ | ---- |
| bookId | string | true | none |        | none |

<h2 id="tocS_ReservationVO">ReservationVO</h2>

<a id="schemareservationvo"></a>
<a id="schema_ReservationVO"></a>
<a id="tocSreservationvo"></a>
<a id="tocsreservationvo"></a>

```json
{
  "id": "string",
  "bookId": "string",
  "bookTitle": "string",
  "bookAuthor": "string",
  "reservationDate": "string",
  "status": "PENDING"
}

```

### 属性

| 名称            | 类型   | 必选 | 约束 | 中文名 | 说明 |
| --------------- | ------ | ---- | ---- | ------ | ---- |
| id              | string | true | none |        | none |
| bookId          | string | true | none |        | none |
| bookTitle       | string | true | none |        | none |
| bookAuthor      | string | true | none |        | none |
| reservationDate | string | true | none |        | none |
| status          | string | true | none |        | none |

#### 枚举值

| 属性   | 值        |
| ------ | --------- |
| status | PENDING   |
| status | AVAILABLE |
| status | FULFILLED |
| status | CANCELLED |

<h2 id="tocS_BooksDeleteDTO">BooksDeleteDTO</h2>

<a id="schemabooksdeletedto"></a>
<a id="schema_BooksDeleteDTO"></a>
<a id="tocSbooksdeletedto"></a>
<a id="tocsbooksdeletedto"></a>

```json
{
  "bookIdList": [
    "string"
  ]
}

```

### 属性

| 名称       | 类型     | 必选 | 约束 | 中文名 | 说明 |
| ---------- | -------- | ---- | ---- | ------ | ---- |
| bookIdList | [string] | true | none |        | none |

<h2 id="tocS_HistoryRecordsDeleteDTO">HistoryRecordsDeleteDTO</h2>

<a id="schemahistoryrecordsdeletedto"></a>
<a id="schema_HistoryRecordsDeleteDTO"></a>
<a id="tocShistoryrecordsdeletedto"></a>
<a id="tocshistoryrecordsdeletedto"></a>

```json
{
  "borrowRecordIdList": [
    "string"
  ]
}

```

### 属性

| 名称               | 类型     | 必选 | 约束 | 中文名 | 说明 |
| ------------------ | -------- | ---- | ---- | ------ | ---- |
| borrowRecordIdList | [string] | true | none |        | none |

<h2 id="tocS_ReservationCancelDTO">ReservationCancelDTO</h2>

<a id="schemareservationcanceldto"></a>
<a id="schema_ReservationCancelDTO"></a>
<a id="tocSreservationcanceldto"></a>
<a id="tocsreservationcanceldto"></a>

```json
{
  "reservationId": "string"
}

```

### 属性

| 名称          | 类型   | 必选 | 约束 | 中文名 | 说明 |
| ------------- | ------ | ---- | ---- | ------ | ---- |
| reservationId | string | true | none |        | none |

<h2 id="tocS_ReservationDetailVO">ReservationDetailVO</h2>

<a id="schemareservationdetailvo"></a>
<a id="schema_ReservationDetailVO"></a>
<a id="tocSreservationdetailvo"></a>
<a id="tocsreservationdetailvo"></a>

```json
{
  "id": "string",
  "userId": "string",
  "bookId": "string",
  "bookTitle": "string",
  "bookAuthor": "string",
  "reservationDate": "string",
  "status": "PENDING"
}

```

### 属性

| 名称            | 类型   | 必选 | 约束 | 中文名 | 说明 |
| --------------- | ------ | ---- | ---- | ------ | ---- |
| id              | string | true | none |        | none |
| userId          | string | true | none |        | none |
| bookId          | string | true | none |        | none |
| bookTitle       | string | true | none |        | none |
| bookAuthor      | string | true | none |        | none |
| reservationDate | string | true | none |        | none |
| status          | string | true | none |        | none |

#### 枚举值

| 属性   | 值        |
| ------ | --------- |
| status | PENDING   |
| status | AVAILABLE |
| status | FULFILLED |
| status | CANCELLED |

<h2 id="tocS_NotificationVO">NotificationVO</h2>

<a id="schemanotificationvo"></a>
<a id="schema_NotificationVO"></a>
<a id="tocSnotificationvo"></a>
<a id="tocsnotificationvo"></a>

```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "type": "DUE_REMINDER",
  "status": "UNREAD",
  "gmtCreate": "string"
}

```

### 属性

| 名称      | 类型   | 必选 | 约束 | 中文名 | 说明 |
| --------- | ------ | ---- | ---- | ------ | ---- |
| id        | string | true | none |        | none |
| title     | string | true | none |        | none |
| content   | string | true | none |        | none |
| type      | string | true | none |        | none |
| status    | string | true | none |        | none |
| gmtCreate | string | true | none |        | none |

#### 枚举值

| 属性   | 值                    |
| ------ | --------------------- |
| type   | DUE_REMINDER          |
| type   | RESERVATION_AVAILABLE |
| type   | OVERDUE_NOTICE        |
| status | UNREAD                |
| status | READ                  |

<h2 id="tocS_UnreadCountVO">UnreadCountVO</h2>

<a id="schemaunreadcountvo"></a>
<a id="schema_UnreadCountVO"></a>
<a id="tocSunreadcountvo"></a>
<a id="tocsunreadcountvo"></a>

```json
{
  "count": 0
}

```

### 属性

| 名称  | 类型    | 必选 | 约束 | 中文名 | 说明 |
| ----- | ------- | ---- | ---- | ------ | ---- |
| count | integer | true | none |        | none |

<h2 id="tocS_ReadNotificationsDTO">ReadNotificationsDTO</h2>

<a id="schemareadnotificationsdto"></a>
<a id="schema_ReadNotificationsDTO"></a>
<a id="tocSreadnotificationsdto"></a>
<a id="tocsreadnotificationsdto"></a>

```json
{
  "notificationIdList": [
    "string"
  ]
}

```

### 属性

| 名称               | 类型     | 必选 | 约束 | 中文名 | 说明 |
| ------------------ | -------- | ---- | ---- | ------ | ---- |
| notificationIdList | [string] | true | none |        | none |

<h2 id="tocS_ReviewCreateDTO">ReviewCreateDTO</h2>

<a id="schemareviewcreatedto"></a>
<a id="schema_ReviewCreateDTO"></a>
<a id="tocSreviewcreatedto"></a>
<a id="tocsreviewcreatedto"></a>

```json
{
  "bookId": "string",
  "rating": 0,
  "comment": "string"
}

```

### 属性

| 名称    | 类型   | 必选 | 约束 | 中文名 | 说明 |
| ------- | ------ | ---- | ---- | ------ | ---- |
| bookId  | string | true | none |        | none |
| rating  | number | true | none |        | none |
| comment | string | true | none |        | none |

<h2 id="tocS_ReviewUpdateDTO">ReviewUpdateDTO</h2>

<a id="schemareviewupdatedto"></a>
<a id="schema_ReviewUpdateDTO"></a>
<a id="tocSreviewupdatedto"></a>
<a id="tocsreviewupdatedto"></a>

```json
{
  "rating": 0,
  "comment": "string"
}

```

### 属性

| 名称    | 类型   | 必选 | 约束 | 中文名 | 说明 |
| ------- | ------ | ---- | ---- | ------ | ---- |
| rating  | number | true | none |        | none |
| comment | string | true | none |        | none |

<h2 id="tocS_ReviewVO">ReviewVO</h2>

<a id="schemareviewvo"></a>
<a id="schema_ReviewVO"></a>
<a id="tocSreviewvo"></a>
<a id="tocsreviewvo"></a>

```json
{
  "id": "string",
  "bookId": "string",
  "userId": "string",
  "username": "string",
  "rating": 0,
  "comment": "string",
  "gmtCreate": "string"
}

```

### 属性

| 名称      | 类型   | 必选 | 约束 | 中文名 | 说明 |
| --------- | ------ | ---- | ---- | ------ | ---- |
| id        | string | true | none |        | none |
| bookId    | string | true | none |        | none |
| userId    | string | true | none |        | none |
| username  | string | true | none |        | none |
| rating    | number | true | none |        | none |
| comment   | string | true | none |        | none |
| gmtCreate | string | true | none |        | none |

<h2 id="tocS_NotificationPushDTO">NotificationPushDTO</h2>

<a id="schemanotificationpushdto"></a>
<a id="schema_NotificationPushDTO"></a>
<a id="tocSnotificationpushdto"></a>
<a id="tocsnotificationpushdto"></a>

```json
{
  "title": "string",
  "content": "string",
  "type": "COMMON",
  "status": "UNREAD"
}

```

### 属性

| 名称    | 类型   | 必选 | 约束 | 中文名 | 说明 |
| ------- | ------ | ---- | ---- | ------ | ---- |
| title   | string | true | none |        | none |
| content | string | true | none |        | none |
| type    | string | true | none |        | none |
| status  | string | true | none |        | none |

#### 枚举值

| 属性   | 值             |
| ------ | -------------- |
| type   | COMMON         |
| type   | DUE_REMINDER   |
| type   | OVERDUE_NOTICE |
| status | UNREAD         |
| status | READ           |

