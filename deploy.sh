#!/bin/bash
# Скрипт деплоя фронтенда
# - Устанавливает зависимости и собирает Vite-приложение
# - Архивирует папку dist и загружает на удаленный сервер (/tmp) через scp
# - Заменяет содержимое удаленной директории /var/www/scrollread.ru новой сборкой
# - Очищает локальные артефакты
set -euo pipefail

# Определение цветов для красивого вывода в консоли
RED='\033[0;31m'      # Красный для ошибок
GREEN='\033[0;32m'    # Зеленый для успеха
YELLOW='\033[1;33m'   # Желтый для предупреждений
BLUE='\033[0;34m'     # Синий для заголовков
NC='\033[0m'          # Сброс цвета (No Color)

echo -e "\033[0;34m╔══════════════════════════════════════╗\033[0m"
echo -e "\033[0;34m║           🌐 ДЕПЛОЙ ФРОНТЕНДА        ║\033[0m"
echo -e "\033[0;34m║        scrollread Frontend Deployment      ║\033[0m"
echo -e "\033[0;34m╚══════════════════════════════════════╝\033[0m"

# Проверка наличия необходимых утилит (scp, ssh, npm)
if ! command -v scp &> /dev/null || ! command -v ssh &> /dev/null; then
  echo -e "${RED}⚠️  Ошибка: scp или ssh не найдены. Установите их для деплоя.${NC}" >&2
  exit 1
fi
if ! command -v npm &> /dev/null; then
  echo -e "${RED}⚠️  Ошибка: npm не найден. Установите Node.js для выполнения скрипта.${NC}" >&2
  exit 1
fi

# Настройки удаленного сервера
SERVER="root@vpn.saibrok.ru"            # Цель SSH: пользователь@хост
FRONTEND_DIR="/var/www/scrollread.ru" # Путь к фронтенду на удаленном сервере

# Определяем пути для локального архива
ARCHIVE_PATH="$(cd "$(dirname "$0")" && pwd)/tmp"
FRONTEND_ARCHIVE="frontend-dist.tar.gz"

# Создаем директорию для временных файлов, если не существует
mkdir -p "$ARCHIVE_PATH"

echo -e "${BLUE}🚀 ==> Шаг 1/4: Установка зависимостей и сборка фронтенда${NC}"
# Определяем корень фронтенда на основе расположения скрипта
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_ROOT="$SCRIPT_DIR"
cd "$FRONTEND_ROOT"
echo -e "    📂 Корень фронтенда: $FRONTEND_ROOT"
# Устанавливаем зависимости и собираем приложение
echo -e "    📦 Установка зависимостей..."
npm ci --legacy-peer-deps
echo -e "    🛠️ Сборка Vite-приложения..."
npm run build
echo -e "    ${GREEN}✅ Сборка завершена${NC}"

echo -e "${BLUE}🚀 ==> Шаг 2/4: Архивация папки dist${NC}"
# Проверяем существование папки dist
if [ ! -d "dist" ]; then
  echo -e "${RED}❌ Ошибка: папка dist не найдена. Проверьте успешность сборки.${NC}" >&2
  exit 1
fi
# Создаем архив из содержимого папки dist
echo -e "    📦 Создаем архив..."
tar -C dist -czf "$ARCHIVE_PATH/$FRONTEND_ARCHIVE" .
echo -e "    ${GREEN}✅ Архив создан: $ARCHIVE_PATH/$FRONTEND_ARCHIVE${NC}"

echo -e "${BLUE}🚀 ==> Шаг 3/4: Загрузка архива на $SERVER:/tmp${NC}"
# Проверяем существование архива перед загрузкой
if [ ! -f "$ARCHIVE_PATH/$FRONTEND_ARCHIVE" ]; then
  echo -e "${RED}❌ Ошибка: архив $ARCHIVE_PATH/$FRONTEND_ARCHIVE не найден${NC}" >&2
  exit 1
fi
# Загружаем архив на сервер через scp
echo -e "    📤 Загрузка архива..."
scp "$ARCHIVE_PATH/$FRONTEND_ARCHIVE" "$SERVER:/tmp/"
echo -e "    ${GREEN}✅ Загрузка завершена${NC}"

echo -e "${BLUE}🚀 ==> Шаг 4/4: Деплой на удаленном хосте${NC}"
# Разворачиваем архив на сервере
ssh "$SERVER" "
  set -e
  # Создаем директорию фронтенда, если не существует
  mkdir -p '$FRONTEND_DIR'
  echo -e '${YELLOW}  🧹 Удаленно: очистка содержимого $FRONTEND_DIR${NC}'
  rm -rf '$FRONTEND_DIR'/*
  echo -e '${BLUE}  📦 Удаленно: извлечение /tmp/$FRONTEND_ARCHIVE в $FRONTEND_DIR${NC}'
  tar -xzf '/tmp/$FRONTEND_ARCHIVE' -C '$FRONTEND_DIR'
  rm -f '/tmp/$FRONTEND_ARCHIVE'
  echo -e '${GREEN}  ✅ Удаленно: деплой завершен${NC}'
"

echo -e "${GREEN}🧹 ==> Очистка локальных артефактов${NC}"
rm -f "$ARCHIVE_PATH/$FRONTEND_ARCHIVE"
echo -e "${GREEN}✅ ==> Готово! Фронтенд задеплоен в $FRONTEND_DIR${NC}"
