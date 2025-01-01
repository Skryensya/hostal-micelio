echo '{' > ./db/ROOM_IMAGES.json && \
for dir in ./public/assets/images/_webp/rooms/*/; do \
  slug=$(basename "$dir"); \
  files=("$dir"*.webp); \
  if [ ${#files[@]} -gt 0 ]; then \
    echo "  \"$slug\": [" >> ./db/ROOM_IMAGES.json; \
    first_file=true; \
    for file in "${files[@]}"; do \
      filename=$(basename "$file"); \
      if [ "$first_file" = true ]; then \
        first_file=false; \
      else \
        echo "," >> ./db/ROOM_IMAGES.json; \
      fi; \
      echo "    {" >> ./db/ROOM_IMAGES.json; \
      echo "      \"src\": \"/assets/images/_webp/rooms/$slug/$filename\"," >> ./db/ROOM_IMAGES.json; \
      echo "      \"thumbnail\": \"/assets/images/_optimized/rooms/$slug/$filename\"," >> ./db/ROOM_IMAGES.json; \
      echo "      \"alt\": \"View of ${slug//-/ } Room\"" >> ./db/ROOM_IMAGES.json; \
      echo -n "    }" >> ./db/ROOM_IMAGES.json; \
    done; \
    echo "" >> ./db/ROOM_IMAGES.json; \
    if [ "$(basename "$(ls -d ./public/assets/images/_webp/rooms/*/ | tail -n1)")" != "$slug" ]; then \
      echo "  ]," >> ./db/ROOM_IMAGES.json; \
    else \
      echo "  ]" >> ./db/ROOM_IMAGES.json; \
    fi; \
  fi; \
done >> ./db/ROOM_IMAGES.json && \
echo '}' >> ./db/ROOM_IMAGES.json