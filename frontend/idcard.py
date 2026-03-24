from PIL import Image, ImageDraw, ImageFont

# -----------------------------
# Card Size
# -----------------------------
width_cm = 5.5
height_cm = 8.7
dpi = 300

width_px = int(width_cm / 2.54 * dpi)
height_px = int(height_cm / 2.54 * dpi)

# -----------------------------
# File Paths
# -----------------------------
profile_path = "/Users/arnab/Downloads/BijonSikhaMemberPictures/Subhankar.jpeg"
logo_path = "/Users/arnab/Downloads/BijonSikhaMemberPictures/bijonsikha.jpg"

# -----------------------------
# Member Details
# -----------------------------
name = "Subhankar Das"
designation = "Marketing Associate Lead"
dob = "09.01.1993"
blood = "B+"
mobile = "9735803750"
emergency_contact = "Sampa Das - 8777466837"

company_mobile = "7980124001"
website = "www.bijonsikha.com"

permanent_address = """Sonarpur, Radhanagar
South 24 Pgs
Kolkata - 700150"""

office_address = """Niramay (BijonSikha Group)
A10/2 Purbadigabta, Santoshpur
Near Gate No. 4, Jadavpur Stadium
Purbadiganta Rickshaw Stand
Kolkata – 700075"""

# -----------------------------
# Create Card
# -----------------------------
card = Image.new("RGB", (width_px, height_px), "white")
draw = ImageDraw.Draw(card)

# -----------------------------
# Fonts
# -----------------------------
try:
    title_font = ImageFont.truetype("Arial Bold.ttf", 36)
    text_font = ImageFont.truetype("Arial.ttf", 22)
except:
    title_font = ImageFont.load_default()
    text_font = ImageFont.load_default()

# -----------------------------
# Rounded Blue Border
# -----------------------------
border_color = (0, 102, 204)
border_width = 12

draw.rounded_rectangle(
    [(border_width, border_width),
     (width_px-border_width, height_px-border_width)],
    radius=40,
    outline=border_color,
    width=border_width
)

# -----------------------------
# Add Logo
# -----------------------------
logo = Image.open(logo_path)
logo = logo.resize((int(width_px*0.45), int(height_px*0.12)))
card.paste(logo, (int(width_px*0.275), 30))

# -----------------------------
# Add Profile Picture
# -----------------------------
profile = Image.open(profile_path)
profile = profile.resize((int(width_px*0.42), int(height_px*0.25)))
card.paste(profile, (int(width_px*0.29), int(height_px*0.18)))

# -----------------------------
# Member Info
# -----------------------------
y = int(height_px * 0.43)

draw.text((60, y), f"Name: {name}", fill="black", font=text_font)
y += 32

draw.text((60, y), f"Designation: {designation}", fill="black", font=text_font)
y += 32

draw.text((60, y), f"DOB: {dob}", fill="black", font=text_font)
y += 28

draw.text((60, y), f"Blood Group: {blood}", fill="black", font=text_font)
y += 28

draw.text((60, y), f"Mobile: {mobile}", fill="black", font=text_font)
y += 28

draw.text((60, y), f"Emergency: {emergency_contact}", fill="black", font=text_font)
y += 25

# -----------------------------
# Permanent Address
# -----------------------------
draw.text((60, y), "Permanent Address:", fill="black", font=text_font)
y += 28

box1_top = y - 5
box1_bottom = y + 80

draw.rectangle(
    [(50, box1_top), (width_px-50, box1_bottom)],
    outline="black",
    width=2
)

draw.multiline_text((60, y), permanent_address, fill="black", font=text_font)

# Space between sections
y = box1_bottom + 40

# -----------------------------
# Office Address
# -----------------------------
draw.text((60, y), "Office Address:", fill="black", font=text_font)
y += 28

box2_top = y - 5
box2_bottom = y + 120

draw.rectangle(
    [(50, box2_top), (width_px-50, box2_bottom)],
    outline="black",
    width=2
)

draw.multiline_text((60, y), office_address, fill="black", font=text_font)

# -----------------------------
# Company Contact
# -----------------------------
y = box2_bottom + 18

draw.text((60, y), f"Company: {company_mobile}", fill="black", font=text_font)
y += 22

draw.text((60, y), f"Website: {website}", fill="black", font=text_font)

# -----------------------------
# Save Card
# -----------------------------
output_path = "/Users/arnab/Downloads/BijonSikhaMemberPictures/subhankar_das_id_card.png"
card.save(output_path, dpi=(dpi, dpi))

print("ID Card generated:", output_path)