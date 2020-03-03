#define ASIO_STANDALONE

#define _WEBSOCKETPP_CPP11_STL_

#include <websocketpp/config/asio_no_tls_client.hpp>
#include <websocketpp/client.hpp>
#include <iostream>

#include "mouse.hpp"
// #include "server.hpp"

typedef websocketpp::client<websocketpp::config::asio_client> client;

using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

typedef websocketpp::config::asio_client::message_type::ptr message_ptr;

void on_message(client* c, websocketpp::connection_hdl hdl, message_ptr msg) {
    if(msg->get_payload() == "ply") {
        Mouse::click(1, true);
        Mouse::click(1, false);
    }
}

int main(int argc, char* argv[]) {
    client c;

    if (argc != 2) {
        std::cout << "Usage: syncclick <ip>|host" << std::endl;
        return 0;
    }

    std::string param = argv[1];

    if(param == "host") {
        std::cout << "lol" << std::endl;
    } else {
        std::string uri = "ws://" + param;

        try {
            c.set_access_channels(websocketpp::log::alevel::all);
            c.clear_access_channels(websocketpp::log::alevel::frame_payload);

            c.init_asio();

            c.set_message_handler(bind(&on_message,&c,::_1,::_2));

            websocketpp::lib::error_code ec;
            client::connection_ptr con = c.get_connection(uri, ec);
            if (ec) {
                std::cout << "could not create connection because: " << ec.message() << std::endl;
                return 0;
            }

            c.connect(con);
            c.run();
        } catch (websocketpp::exception const & e) {
            std::cout << e.what() << std::endl;
        }
    }

    
}