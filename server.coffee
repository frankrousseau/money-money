americano = require 'americano'

port = process.env.PORT || 9233
americano.start name: 'template', port: port
