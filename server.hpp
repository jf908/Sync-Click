#pragma once

#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>

typedef std::set<connection_hdl,std::owner_less<connection_hdl>> con_list;
typedef websocketpp::server<websocketpp::config::asio> server;

class Broadcaster {
    private:
        server m_server;
        con_list m_connections;

    public:
        Broadcaster();

        void on_open(connection_hdl hdl);
        void on_close(connection_hdl hdl);

        void send(std::string);

        void run(uint16_t port);
};