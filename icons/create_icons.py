from PIL import Image, ImageDraw, ImageFont

def create_icon(size):
    # Create image with gradient background
    img = Image.new('RGB', (size, size), color=(102, 102, 241))
    draw = ImageDraw.Draw(img)
    
    # Draw a simple "S" letter
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * 0.6))
    except:
        font = ImageFont.load_default()
    
    # Calculate text position
    text = "S"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - int(size * 0.1)
    
    # Draw text
    draw.text((x, y), text, fill=(255, 255, 255), font=font)
    
    return img

# Create icons
for size in [16, 48, 128]:
    img = create_icon(size)
    img.save(f"{size}.png")
    print(f"Created {size}.png")

print("Icons created successfully!")
