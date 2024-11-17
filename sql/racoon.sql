-- racoon.empresa definition

CREATE TABLE `empresa` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `nome_empresa` varchar(255) NOT NULL,
  `nome_criador` varchar(255) NOT NULL,
  `cnpj` varchar(14) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `criado` datetime NOT NULL DEFAULT current_timestamp(),
  `modificado` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `excluido` datetime DEFAULT NULL,
  `plano` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- racoon.cliente definition

CREATE TABLE `cliente` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `cpf` varchar(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `criado` datetime DEFAULT current_timestamp(),
  `atualizado` datetime DEFAULT current_timestamp(),
  `excluido` tinyint(1) DEFAULT NULL,
  `id_empresa` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- racoon.funcionario definition

CREATE TABLE `funcionario` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(10) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `criado` datetime NOT NULL DEFAULT current_timestamp(),
  `modificado` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `excluido` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `funcionario_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- racoon.produto definition

CREATE TABLE `produto` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(10) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `codigo_barras` varchar(255) NOT NULL,
  `valor` float(10,2) NOT NULL,
  `porcentagem_cashback` float(5,2) NOT NULL,
  `criado` datetime NOT NULL DEFAULT current_timestamp(),
  `modificado` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `excluido` datetime DEFAULT NULL,
  `categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `produto_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- racoon.caixa definition

CREATE TABLE `caixa` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(10) NOT NULL,
  `id_funcionario` int(10) DEFAULT NULL,
  `aberto` datetime NOT NULL DEFAULT current_timestamp(),
  `fechado` datetime DEFAULT NULL,
  `valor_inicial` decimal(10,2) NOT NULL,
  `valor_final` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_empresa` (`id_empresa`),
  KEY `id_funcionario` (`id_funcionario`),
  CONSTRAINT `caixa_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id`) ON DELETE CASCADE,
  CONSTRAINT `caixa_ibfk_2` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- racoon.compras definition

CREATE TABLE `compras` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(10) NOT NULL,
  `id_produto` int(10) NOT NULL,
  `id_funcionario` int(10) DEFAULT NULL,
  `id_caixa` int(11) DEFAULT NULL,
  `compra` datetime NOT NULL DEFAULT current_timestamp(),
  `quantidade` int(11) NOT NULL DEFAULT 1,
  `valor_cashback` decimal(10,2) NOT NULL DEFAULT 0.00,
  `data_resgate_cashback` datetime DEFAULT NULL,
  `status_cashback` enum('DISPONIVEL','RESGATADO','EXPIRADO') DEFAULT 'DISPONIVEL',
  `metodo_pagamento` varchar(50) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_produto` (`id_produto`),
  KEY `id_funcionario` (`id_funcionario`),
  KEY `fk_compras_caixa` (`id_caixa`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id`) ON DELETE CASCADE,
  CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id`) ON DELETE CASCADE,
  CONSTRAINT `compras_ibfk_3` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionario` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_compras_caixa` FOREIGN KEY (`id_caixa`) REFERENCES `caixa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;