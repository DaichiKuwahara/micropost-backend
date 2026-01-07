# 1. ビルドステージ: 依存関係のインストールとビルドを実行
FROM node:lts-alpine AS builder 
WORKDIR /usr/src/app

# package.jsonをコピーし、依存関係をインストール
COPY package*.json ./
RUN npm install

# プロジェクトのソースコードをコピー
COPY . .

# TypeScriptをJavaScriptにトランスパイル（NestJSのビルドを実行）
RUN npm run build

# ★ 最終的な権限修正 ★
# 全てのファイルを非特権ユーザー 'node' の所有に変更
RUN chown -R node:node /usr/src/app

# 2. 本番（実行）ステージ: 軽量化とセキュリティのため、最終的なファイルのみをコピー
FROM node:lts-alpine AS production



WORKDIR /usr/src/app

# ビルドステージから必要なファイル（package.json, node_modules, dist）のみをコピー
COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist

EXPOSE 3001 

# 開発モードの起動は docker-compose.yml の entrypoint に任せるため、
# ここでは本番起動コマンドを設定しておく
CMD ["node", "dist/main"]