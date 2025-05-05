print("--- Script Started ---")
import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

print("--- Importing Flask ---")
from flask import Flask, request, jsonify, send_from_directory
print("--- Importing CORS ---")
from flask_cors import CORS
print("--- Importing Mail ---")
from flask_mail import Mail, Message
print("--- Importing PIL ---")
from PIL import Image
print("--- Importing io, base64, datetime ---")
import io
import base64
import datetime

print("--- Initializing Flask App ---")
app = Flask(__name__, static_folder='static', static_url_path='/static')
print("--- Initializing CORS ---")
CORS(app) # Enable CORS for all routes
print("--- Configuring Mail ---")
# --- Configuration (Use Environment Variables in Production) ---
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.example.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'your-email@example.com')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your-password')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'contato@lpformaturas.com.br')

print("--- Initializing Mail ---")
mail = Mail(app)

print("--- Configuring Upload Folder ---")
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

print("--- Defining Routes ---")
# --- Routes ---

@app.route('/')
def index():
    # Serve the main HTML file from the static folder
    return send_from_directory(app.static_folder, 'index.html')

# @app.route("/remove-bg", methods=["POST"])
# def remove_background_route():
#     try:
#         data = request.get_json()
#         if not data or "image_data" not in data:
#             return jsonify({"success": False, "error": "No image data provided"}), 400
#
#         image_data_url = data["image_data"]
#         # Decode the base64 image data
#         header, encoded = image_data_url.split(",", 1)
#         image_data = base64.b64decode(encoded)
#         input_image = Image.open(io.BytesIO(image_data))
#
#         # Remove the background
#         # output_image = remove(input_image) # Removed rembg dependency
#         output_image = input_image # Keep original image if rembg is removed
#
#         # Convert the output image back to base64 data URL
#         buffered = io.BytesIO()
#         output_image.save(buffered, format="PNG")
#         img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
#         output_data_url = f"data:image/png;base64,{img_str}"
#
#         return jsonify({"success": True, "image_data_no_bg": output_data_url})
#
#     except Exception as e:
#         print(f"Error removing background: {e}")
#         return jsonify({"success": False, "error": str(e)}), 500

@app.route('/finalizar', methods=['POST'])
def finalizar_pedido():
    try:
        pedido = request.get_json()
        if not pedido:
            return jsonify({'success': False, 'error': 'No data received'}), 400

        # Extract data
        cor_canudo = pedido.get('cor_canudo', 'N/A')
        cor_gravacao = pedido.get('cor_gravacao', 'N/A')
        textos = pedido.get('textos', []) # Array of {texto: '...', fonte: '...'} or empty
        logos = pedido.get('logos', [])   # Array of {logo_data_url: '...', index: ...} or empty
        nome_cliente = pedido.get('nome_cliente', 'N/A')
        email_cliente = pedido.get('email_cliente')
        confirmacao = pedido.get('confirmacao_layout', False)

        if not email_cliente or not confirmacao:
            return jsonify({'success': False, 'error': 'Email do cliente e confirmação são obrigatórios'}), 400

        # --- Prepare Email Content ---
        today_date = datetime.date.today().strftime('%Y-%m-%d')
        subject_empresa = f"{nome_cliente} - {today_date} - Personalização do pedido"
        subject_cliente = f"Confirmação do seu pedido de canudo personalizado - {today_date}"

        # Build HTML body
        body_html = f"""
        <html>
        <body>
            <h2>Detalhes do Pedido de Personalização</h2>
            <p><strong>Cliente:</strong> {nome_cliente}</p>
            <p><strong>Email:</strong> {email_cliente}</p>
            <p><strong>Data:</strong> {today_date}</p>
            <p><strong>Cor do Canudo:</strong> {cor_canudo}</p>
            <p><strong>Cor da Gravação (Textos):</strong> {cor_gravacao}</p>
            <hr>
            <h3>Textos Personalizados:</h3>
        """
        if textos:
            for i, txt_info in enumerate(textos):
                body_html += f"<p><strong>Texto {i+1}:</strong> {txt_info.get('texto', 'N/A')} (Fonte: {txt_info.get('fonte', 'N/A')})</p>"
        else:
            body_html += "<p>Nenhum texto adicionado.</p>"

        body_html += """
            <hr>
            <h3>Logos/Imagens Personalizadas:</h3>
        """
        attachments = []
        if logos:
            for i, logo_info in enumerate(logos):
                logo_data_url = logo_info.get('logo_data_url')
                logo_index = logo_info.get('index', i+1)
                if logo_data_url:
                    try:
                        header, encoded = logo_data_url.split(',', 1)
                        logo_data = base64.b64decode(encoded)
                        filename = f"logo_{logo_index}_{nome_cliente}_{today_date}.png"
                        content_type = 'image/png'
                        attachments.append((filename, content_type, logo_data))
                        body_html += f"<p><strong>Logo {logo_index}:</strong> (Anexado como {filename})</p>"
                    except Exception as e:
                        print(f"Error processing logo {logo_index} for email: {e}")
                        body_html += f"<p><strong>Logo {logo_index}:</strong> Erro ao processar imagem.</p>"
        else:
            body_html += "<p>Nenhum logo adicionado.</p>"

        body_html += """
            <hr>
            <p><strong>Confirmação do Layout:</strong> Sim</p>
        </body>
        </html>
        """

        # --- Send Emails (Simulated - Requires real SMTP config) ---
        try:
            # Email para a Empresa
            msg_empresa = Message(subject=subject_empresa,
                                  recipients=[app.config['MAIL_DEFAULT_SENDER']], # Send to company email
                                  html=body_html)
            for attachment in attachments:
                msg_empresa.attach(attachment[0], attachment[1], attachment[2])
            # mail.send(msg_empresa) # Uncomment to send real email
            print(f"Simulating sending email to Empresa: {app.config['MAIL_DEFAULT_SENDER']}")

            # Email para o Cliente
            msg_cliente = Message(subject=subject_cliente,
                                  recipients=[email_cliente], # Send to client email
                                  html=body_html)
            for attachment in attachments:
                msg_cliente.attach(attachment[0], attachment[1], attachment[2])
            # mail.send(msg_cliente) # Uncomment to send real email
            print(f"Simulating sending email to Cliente: {email_cliente}")

            return jsonify({'success': True, 'message': 'Pedido finalizado e emails (simulados) enviados.'})

        except Exception as e:
            print(f"Error sending email: {e}")
            # Still return success to the user, but log the email error
            return jsonify({'success': True, 'message': 'Pedido finalizado, mas houve um erro ao enviar os emails de confirmação.'})

    except Exception as e:
        print(f"Error in /finalizar: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

print("--- Entering Main Block ---")
# --- Run Application ---
if __name__ == '__main__':
    print("--- Running App ---")
    # Listen on all interfaces, important for Docker/Expose
    app.run(host='0.0.0.0', port=5001, debug=True)

