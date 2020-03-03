#include "server.hpp"

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

typedef websocketpp::server<websocketpp::config::asio> server;

using websocketpp::connection_hdl;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

Broadcaster::Broadcaster() {
    m_server.init_asio();
    
    m_server.set_open_handler(bind(&broadcast_server::on_open,this,::_1));
    m_server.set_close_handler(bind(&broadcast_server::on_close,this,::_1));
}

void Broadcaster::on_open(connection_hdl hdl) {
    m_connections.insert(hdl);
}

void Broadcaster::on_close(connection_hdl hdl) {
    m_connections.erase(hdl);
}

void Broadcaster::run(uint16_t port) {
    m_server.listen(port);
    m_server.start_accept();
    m_server.run();
}

void Broadcaster::send(std::string str) {
    for(auto it : m_connections) {
        m_server.send(it, str);
    }
}