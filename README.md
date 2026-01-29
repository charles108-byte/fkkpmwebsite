# ExcavatorPartsPro - 商品数据管理指南

## 📋 项目概述

这是一个桌面端工程机械配件展示网站，包含450个商品数据，支持30页分页浏览和商品详情查看。

## 📁 文件结构

```
excavator-parts/
├── products.html           # 商品列表页
├── product-detail.html     # 商品详情页
├── style.css              # 样式文件
├── products.js            # 商品数据与分页逻辑
├── product-detail.js      # 商品详情页逻辑
├── products.json          # 商品数据文件（核心）
├── generate-products.js   # 商品数据生成脚本
└── README.md             # 本文件
```

## 🔧 如何修改商品数据

### 方法一：直接编辑 JSON 文件（推荐用于少量修改）

1. **打开 `products.json` 文件**
   - 使用任何文本编辑器（VS Code、Notepad++等）
   - 确保文件格式为 UTF-8 编码

2. **了解商品数据结构**

   每个商品对象包含以下字段：

   ```json
   {
     "id": "KWSK-000001",              // 商品唯一ID（必填）
     "name": "商品名称",                // 商品完整名称（必填）
     "partNumber": "KOM-HYD-0001",    // 零件号（必填）
     "oemNumber": "KO7001234",       // OEM号（可选）
     "brand": "komatsu",              // 品牌（必填，小写）
     "model": ["PC200-8"],            // 适用机型数组（必填）
     "category": "hydraulic",          // 分类（必填）
     "subcategory": "travel-motors",   // 子分类（必填）
     "hasPrice": true,                 // 是否有价格（必填）
     "pricePosition": "after-name",    // 价格显示位置（必填）
     "stock": 15,                      // 库存数量（必填）
     "stockStatus": "in-stock",        // 库存状态：in-stock/low-stock/out-of-stock
     "leadTime": "3-5 business days", // 交期（必填）
     "weight": "18.5 kg",             // 重量（可选）
     "dimensions": "30×25×20 cm",     // 尺寸（可选）
     "images": [                       // 图片数组（必填，至少1张）
       {
         "url": "图片URL",
         "alt": "图片ALT描述文本"
       }
     ],
     "description": "商品描述",        // 商品详细描述（必填）
     "specifications": {              // 技术规格（可选）
       "Maximum Pressure": "350 bar",
       "Weight": "18.5 kg"
     },
     "compatibility": ["PC200-8"],    // 兼容机型列表（必填）
     "features": ["OEM quality"],      // 特性列表（可选）
     "tags": ["best-seller"]           // 标签（可选）
   }
   ```

3. **修改商品信息**

   **添加新商品：**
   - 在 `products` 数组中添加新的商品对象
   - 确保 `id` 唯一（格式：KWSK-XXXXXX）
   - 更新 `meta.totalProducts` 为新的商品总数

   **修改现有商品：**
   - 找到对应的商品对象
   - 直接修改需要更改的字段值
   - 保存文件

   **删除商品：**
   - 从 `products` 数组中删除对应的商品对象
   - 更新 `meta.totalProducts` 为新的商品总数

4. **更新元数据**

   修改商品后，需要更新以下元数据：

   ```json
   {
     "meta": {
       "totalProducts": 450,        // 更新为实际商品总数
       "productsPerPage": 15,       // 每页显示数量（通常不变）
       "totalPages": 30             // 总页数 = Math.ceil(totalProducts / productsPerPage)
     }
   }
   ```

5. **验证 JSON 格式**

   - 确保 JSON 格式正确（可以使用在线 JSON 验证工具）
   - 确保所有引号、逗号、括号匹配
   - 确保没有语法错误

### 方法二：使用生成脚本（推荐用于批量生成或重置）

1. **运行生成脚本**

   ```bash
   node generate-products.js
   ```

2. **脚本会自动生成**
   - 450个商品数据
   - 按品牌和分类分布
   - 包含完整的商品信息

3. **自定义生成规则**

   编辑 `generate-products.js` 文件可以修改：

   - **品牌分布**：修改 `brandCounts` 对象
   ```javascript
   const brandCounts = {
       komatsu: 150,      // 修改数量
       caterpillar: 120,
       // ...
   };
   ```

   - **分类分布**：修改 `categoryDistribution` 对象
   ```javascript
   const categoryDistribution = {
       hydraulic: 0.40,    // 40%
       engine: 0.25,       // 25%
       // ...
   };
   ```

   - **商品名称规则**：修改生成逻辑
   - **图片ALT文本规则**：修改图片生成部分

4. **重新运行脚本**

   ```bash
   node generate-products.js
   ```

   脚本会覆盖现有的 `products.json` 文件。

## 📝 字段说明

### 必填字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | string | 商品唯一标识符 | "KWSK-000001" |
| `name` | string | 商品完整名称 | "Komatsu PC200-8 Hydraulic Travel Motor" |
| `partNumber` | string | 零件号 | "KOM-HYD-0001" |
| `brand` | string | 品牌（小写） | "komatsu" |
| `model` | array | 适用机型数组 | ["PC200-8", "PC200LC-8"] |
| `category` | string | 商品分类 | "hydraulic" |
| `subcategory` | string | 子分类 | "travel-motors" |
| `hasPrice` | boolean | 是否有价格 | true |
| `pricePosition` | string | 价格位置标记 | "after-name" |
| `stock` | number | 库存数量 | 15 |
| `stockStatus` | string | 库存状态 | "in-stock" |
| `leadTime` | string | 交期 | "3-5 business days" |
| `images` | array | 图片数组（至少1张） | [{url, alt}] |
| `description` | string | 商品描述 | "Complete description..." |
| `compatibility` | array | 兼容机型 | ["PC200-8"] |

### 可选字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `oemNumber` | string | OEM零件号 | "KO7001234" |
| `weight` | string | 重量 | "18.5 kg" |
| `dimensions` | string | 尺寸 | "30×25×20 cm" |
| `specifications` | object | 技术规格 | {"Max Pressure": "350 bar"} |
| `features` | array | 特性列表 | ["OEM quality"] |
| `tags` | array | 标签 | ["best-seller"] |

### 字段值规范

**品牌 (brand)：**
- 必须小写
- 可选值：`komatsu`, `caterpillar`, `hitachi`, `volvo`, `doosan`, `liebherr`, `kobelco`, `hyundai`

**分类 (category)：**
- 可选值：`hydraulic`, `engine`, `undercarriage`, `electrical`

**库存状态 (stockStatus)：**
- 可选值：`in-stock`, `low-stock`, `out-of-stock`

**图片ALT文本规范：**
- 格式：`[品牌] [机型] [部件类型] [视图角度] - [关键特征]`
- 示例：`"Komatsu PC200-8 hydraulic travel motor front view showing mounting flange"`

## 🎨 价格标注位置说明

**重要：** 本项目不显示具体价格值，只显示价格标注位置。

### 商品列表页价格显示

```html
<div class="price-container">
  <span class="price-label">Price:</span>
  <span class="price-value"></span>  <!-- 价格值留空 -->
</div>
```

### 商品详情页价格显示

```html
<div class="detail-price">
  <span class="price-label">Price:</span>
  <span class="price-placeholder"></span>  <!-- 价格占位符留空 -->
</div>
```

**如需添加价格显示功能：**
1. 在 `products.json` 中添加 `price` 字段
2. 修改 `products.js` 中的 `createProductCard` 函数
3. 修改 `product-detail.js` 中的 `renderProductDetail` 函数

## 🔍 搜索功能说明

搜索功能支持以下字段：
- 商品名称 (`name`)
- 零件号 (`partNumber`)
- OEM号 (`oemNumber`)
- 品牌 (`brand`)
- 适用机型 (`model`)

搜索不区分大小写，支持部分匹配。

## 📄 分页系统说明

- **固定30页**：无论搜索结果如何，分页导航始终显示30页
- **每页15个商品**：`productsPerPage: 15`
- **URL参数**：`products.html?page=5` 直接访问第5页
- **搜索参数**：`products.html?search=PC200` 搜索并显示结果

## ⚠️ 注意事项

1. **JSON 格式**
   - 确保 JSON 格式正确，使用双引号
   - 最后一个对象后不要加逗号
   - 使用 JSON 验证工具检查格式

2. **ID 唯一性**
   - 每个商品的 `id` 必须唯一
   - 建议使用格式：`KWSK-XXXXXX`（6位数字）

3. **图片 ALT 文本**
   - 所有图片必须包含 `alt` 字段
   - ALT 文本应该详细描述图片内容
   - 有助于 SEO 和可访问性

4. **元数据同步**
   - 修改商品数量后，记得更新 `meta.totalProducts`
   - 更新 `meta.totalPages` 为新的总页数

5. **备份数据**
   - 修改前建议备份 `products.json` 文件
   - 可以使用版本控制（Git）管理数据变更

## 🚀 快速开始

1. **查看现有商品**
   ```bash
   # 打开 products.json 查看商品数据
   ```

2. **添加单个商品**
   - 打开 `products.json`
   - 在 `products` 数组中添加新商品对象
   - 更新 `meta.totalProducts` 和 `meta.totalPages`
   - 保存文件

3. **批量生成商品**
   ```bash
   node generate-products.js
   ```

4. **测试修改**
   - 在浏览器中打开 `products.html`
   - 检查商品是否正确显示
   - 测试搜索和分页功能

## 📞 技术支持

如有问题，请检查：
1. JSON 格式是否正确
2. 浏览器控制台是否有错误信息
3. 文件路径是否正确
4. 商品数据字段是否完整

---

**最后更新：** 2025-01-15


