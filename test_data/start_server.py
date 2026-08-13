#!/usr/bin/env python
import os
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer


class CORSRequestHandler(SimpleHTTPRequestHandler):
	def end_headers(self):
		self.send_header("Access-Control-Allow-Origin", "*")
		self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		self.send_header("Access-Control-Allow-Headers", "*")
		super().end_headers()

	def do_OPTIONS(self):
		self.send_response(204)
		self.end_headers()


host = os.getenv("HOST", "0.0.0.0")
port = int(os.getenv("PORT", "8080"))

with TCPServer((host, port), CORSRequestHandler) as httpd:
	print(f"Serving test_data at http://{host}:{port}")
	httpd.serve_forever()