import os
import hashlib
from datetime import datetime
import glob
import shutil

def generate_file_hash(filepath):
    """Generate a hash for a file's contents"""
    with open(filepath, 'rb') as f:
        file_hash = hashlib.md5(f.read()).hexdigest()[:8]
    return file_hash

def ensure_dist_directory(root_dir):
    """Ensure dist directory exists and is empty"""
    dist_dir = os.path.join(root_dir, 'dist')
    if os.path.exists(dist_dir):
        try:
            shutil.rmtree(dist_dir)
        except PermissionError:
            # Handle permission errors by making files writable first
            for root, dirs, files in os.walk(dist_dir):
                for name in files:
                    filepath = os.path.join(root, name)
                    try:
                        os.chmod(filepath, 0o777)  # Make file writable
                        os.unlink(filepath)  # Then delete it
                    except Exception:
                        pass
            # Try removing the directory again
            shutil.rmtree(dist_dir, ignore_errors=True)
    os.makedirs(dist_dir)
    return dist_dir

def copy_to_dist(src_dir, dist_dir):
    """Copy directory structure to dist directory"""
    for root, dirs, files in os.walk(src_dir):
        # Skip dist directory and any paths containing dist
        if 'dist' in root.split(os.sep):
            continue
            
        # Create corresponding directories in dist
        relative_path = os.path.relpath(root, src_dir)
        dest_path = os.path.join(dist_dir, relative_path)
        if not os.path.exists(dest_path):
            os.makedirs(dest_path)
        
        # Copy files (except those that will be processed)
        for file in files:
            src_file = os.path.join(root, file)
            dest_file = os.path.join(dest_path, file)
            if not (file.endswith('.html') or file.endswith('.css') or file.endswith('.js')):
                shutil.copy2(src_file, dest_file)

def process_static_files(src_dir, dist_dir):
    """Process all HTML, CSS, and JS files in the directory structure"""
    html_files = []
    asset_mapping = {}  # Store original to hashed filename mappings
    
    # First pass: find all CSS/JS files and generate hashed versions
    for root, _, files in os.walk(src_dir):
        # Skip dist directory and any paths containing dist
        if 'dist' in root.split(os.sep):
            continue
            
        for filename in files:
            if filename.endswith('.css') or filename.endswith('.js'):
                src_filepath = os.path.join(root, filename)
                file_hash = generate_file_hash(src_filepath)
                
                # Split filename and extension
                name, ext = os.path.splitext(filename)
                hashed_filename = f"{name}-{file_hash}{ext}"
                
                # Determine destination path
                relative_path = os.path.relpath(root, src_dir)
                dest_dir = os.path.join(dist_dir, relative_path)
                hashed_filepath = os.path.join(dest_dir, hashed_filename)
                
                # Copy file with hashed name to dist
                os.makedirs(dest_dir, exist_ok=True)
                with open(src_filepath, 'rb') as src, open(hashed_filepath, 'wb') as dst:
                    dst.write(src.read())
                
                # Store mapping for HTML reference updates
                asset_mapping[filename] = hashed_filename
    
    # Second pass: process HTML files in dist directory
    for root, _, files in os.walk(src_dir):
        # Skip dist directory and any paths containing dist
        if 'dist' in root.split(os.sep):
            continue
            
        for filename in files:
            if filename.endswith('.html'):
                src_filepath = os.path.join(root, filename)
                
                # Determine destination path
                relative_path = os.path.relpath(root, src_dir)
                dest_dir = os.path.join(dist_dir, relative_path)
                dest_filepath = os.path.join(dest_dir, filename)
                html_files.append(dest_filepath)
                
                # Read source HTML
                with open(src_filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace all CSS and JS references
                for original, hashed in asset_mapping.items():
                    content = content.replace(original, hashed)
                
                # Write updated content to dist
                os.makedirs(dest_dir, exist_ok=True)
                with open(dest_filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
    
    return html_files

def generate_sitemap(html_files, dist_dir, base_url="https://omninav.uk"):
    """Generate sitemap.xml from HTML files"""
    sitemap_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n"""
    
    today = datetime.now().strftime('%Y-%m-%d')
    processed_urls = set()
    
    for filepath in html_files:
        # Convert file path to URL path
        relative_path = os.path.relpath(filepath, dist_dir)
        # Normalize path separators and remove any duplicate dist/
        relative_path = relative_path.replace('\\', '/').replace('dist/dist/', 'dist/')
        
        # Skip any files in or below dist directory
        if relative_path.startswith('dist') or '/dist/' in relative_path:
            continue
            
        if os.path.basename(filepath) == 'index.html':
            if os.path.dirname(relative_path) == '.':
                # Root index.html - use base URL directly
                full_url = base_url + "/"
            else:
                # Subdirectory index.html
                dir_path = os.path.dirname(relative_path)
                full_url = f"{base_url}/{dir_path}/"
        else:
            full_url = f"{base_url}/{relative_path}"
        
        # Normalize URL and check for duplicates
        full_url = full_url.replace('//', '/').replace(':/', '://')
        if full_url not in processed_urls:
            processed_urls.add(full_url)
            sitemap_content += f"""    <url>
        <loc>{full_url}</loc>
        <lastmod>{today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>\n"""
    
    sitemap_content += "</urlset>"
    
    with open(os.path.join(dist_dir, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write(sitemap_content)

def main():
    # Assuming the script is run from the project root directory
    root_dir = os.getcwd()
    dist_dir = ensure_dist_directory(root_dir)
    
    # Copy all files to dist first
    copy_to_dist(root_dir, dist_dir)
    
    print("Processing static files...")
    html_files = process_static_files(root_dir, dist_dir)
    
    print("Generating sitemap.xml...")
    generate_sitemap(html_files, dist_dir)
    
    print(f"Done! Files have been generated in {dist_dir}")

# 确保 main() 函数只在脚本直接运行时执行
if __name__ == "__main__":
    main()