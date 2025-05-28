#!/bin/bash

# 执行当前目录的 build.py
python build.py

# 检查 build.py 是否成功执行
if [ $? -eq 0 ]; then
    echo "build.py 执行成功，准备提交代码..."
    
    # 进入 dist 子目录
    cd dist || exit 1
    
    # 获取当前日期时间作为提交信息
    commit_message="$(date +'%Y-%m-%d %H:%M:%S')"
    
    # 执行 git 命令
    git add .
    git commit -m "$commit_message"
    git push --force origin main
    
    echo "代码提交完成！"
else
    echo "build.py 执行失败，请检查错误！"
    exit 1
fi