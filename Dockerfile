# ベースイメージを指定
FROM ubuntu:latest

# イメージのメタデータ
LABEL maintainer="your_email@example.com"

# apt-getを使って必要なパッケージをインストール
RUN apt-get update \
    && apt-get install -y \
        gdb \
        # package2 \
        # package3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# コンテナが起動したときに実行されるコマンド
CMD ["/bin/bash"]
