/**
 * Tabela de comissões do Mercado Livre por categoria/subcategoria.
 * Fonte: planilha "Tarifa Mercado Livre"
 */

export interface CategoryCommission {
  category: string;
  subcategory?: string;
  commission: number;
}

export const ML_COMMISSIONS: CategoryCommission[] = [
  // Acessórios para Veículos - 12%
  { category: 'Acessórios para Veículos', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Aces. de Carros e Caminhonetes', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Aces. de Motos e Quadriciclos', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Acessórios Náuticos', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Acessórios de Linha Pesada', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Ferramentas para Veículos', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'GNV', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Limpeza Automotiva', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Lubrificantes e Fluidos', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Motos', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Navegadores GPS para Veículos', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Performance', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Peças Náuticas', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Peças de Carros e Caminhonetes', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Peças de Linha Pesada', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Peças de Motos e Quadriciclos', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Pneus e Acessórios', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Rodas', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Segurança Veicular', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Serviços Programados', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Som Automotivo', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Tags de Pagamento de Pedágio', commission: 12 },
  { category: 'Acessórios para Veículos', subcategory: 'Tuning', commission: 12 },

  // Alimentos e Bebidas - 14%
  { category: 'Alimentos e Bebidas', commission: 14 },
  { category: 'Alimentos e Bebidas', subcategory: 'Bebidas', commission: 14 },
  { category: 'Alimentos e Bebidas', subcategory: 'Comida Preparada', commission: 14 },
  { category: 'Alimentos e Bebidas', subcategory: 'Congelados', commission: 14 },

  // Pet Shop - 14%
  { category: 'Pet Shop', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Anfíbios e Répteis', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Aves e Acessórios', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Botas', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Capas de chuva', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Cavalos', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Cintos de segurança', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Coelhos', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Coleiras', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Cortadores de Unhas', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Creme Dental', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Cães', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Escovas e Pentes', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Fraldas', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Gaiolas para Animais', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Gatos', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Guias para Animais', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Insetos', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Laços', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Recipiente para Ração', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Repelentes Ultrassônicos', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Roedores', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Roupas de Inverno', commission: 14 },
  { category: 'Pet Shop', subcategory: 'Sabonete', commission: 14 },

  // Arte, Papelaria e Armarinho - 12%
  { category: 'Arte, Papelaria e Armarinho', commission: 12 },
  { category: 'Arte, Papelaria e Armarinho', subcategory: 'Arte e Trabalhos Manuais', commission: 12 },
  { category: 'Arte, Papelaria e Armarinho', subcategory: 'Artigos de Armarinho', commission: 12 },
  { category: 'Arte, Papelaria e Armarinho', subcategory: 'Materiais Escolares', commission: 12 },

  // Bebês - 14%
  { category: 'Bebês', commission: 14 },
  { category: 'Bebês', subcategory: 'Alimentação e Amamentação', commission: 14 },
  { category: 'Bebês', subcategory: 'Alimentos para Bebês', commission: 14 },
  { category: 'Bebês', subcategory: 'Andadores e Mini Veículos', commission: 14 },
  { category: 'Bebês', subcategory: 'Banho do Bebê', commission: 14 },
  { category: 'Bebês', subcategory: 'Brinquedos para Bebês', commission: 14 },
  { category: 'Bebês', subcategory: 'Cercadinho', commission: 14 },
  { category: 'Bebês', subcategory: 'Chupetas e Mordedores', commission: 14 },
  { category: 'Bebês', subcategory: 'Higiene e Cuidados com o Bebê', commission: 14 },
  { category: 'Bebês', subcategory: 'Maternidade', commission: 14 },
  { category: 'Bebês', subcategory: 'Passeio do Bebê', commission: 14 },
  { category: 'Bebês', subcategory: 'Quarto do Bebê', commission: 14 },
  { category: 'Bebês', subcategory: 'Roupas de Bebê', commission: 14 },
  { category: 'Bebês', subcategory: 'Saúde do Bebê', commission: 14 },
  { category: 'Bebês', subcategory: 'Segurança para Bebê', commission: 14 },

  // Beleza e Cuidado Pessoal - 14%
  { category: 'Beleza e Cuidado Pessoal', commission: 14 },
  { category: 'Beleza e Cuidado Pessoal', subcategory: 'Artefatos para Cabelo', commission: 14 },
  { category: 'Beleza e Cuidado Pessoal', subcategory: 'Artigos para Cabeleireiros', commission: 14 },
  { category: 'Beleza e Cuidado Pessoal', subcategory: 'Barbearia', commission: 14 },
  { category: 'Beleza e Cuidado Pessoal', subcategory: 'Cuidados com a Pele', commission: 14 },
  { category: 'Beleza e Cuidado Pessoal', subcategory: 'Higiene Pessoal', commission: 14 },
  { category: 'Beleza e Cuidado Pessoal', subcategory: 'Manicure e Pedicure', commission: 14 },
  { category: 'Beleza e Cuidado Pessoal', subcategory: 'Maquiagem', commission: 14 },
  { category: 'Beleza e Cuidado Pessoal', subcategory: 'Perfumes', commission: 14 },
  { category: 'Beleza e Cuidado Pessoal', subcategory: 'Tratamentos de Beleza', commission: 14 },

  // Brinquedos e Hobbies - 11.5%
  { category: 'Brinquedos e Hobbies', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Anti-stress e Engenho', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Ar Livre e Playground', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Artes e Atividades', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Bonecos e Bonecas', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Brinquedos Eletrônicos', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Brinquedos de Faz de Conta', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Brinquedos de Montar', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Brinquedos de Pegadinhas', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Brinquedos de Praia e Piscina', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Brinquedos para Bebês', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Casinhas e Barracas', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Fantoches e Marionetas', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Hobbies', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Instrumentos Musicais', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Jogos de Salão', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Jogos de Tabuleiro e Cartas', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Lançadores de Brinquedo', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Mesas e Cadeiras', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Mini Veículos e Bicicletas', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Miniaturas', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Patins e Skates', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Pelúcias', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Piscinas de Bolas e Infláveis', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Veículos de Brinquedo', commission: 11.5 },
  { category: 'Brinquedos e Hobbies', subcategory: 'Álbuns e Figurinhas', commission: 11.5 },

  // Calçados, Roupas e Bolsas - 14%
  { category: 'Calçados, Roupas e Bolsas', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Bermudas e Shorts', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Blusas', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Calçados', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Calças', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Camisas', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Camisetas e Regatas', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Indumentária Laboral e Escolar', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Kimonos', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Kits de Conjuntos de Roupa', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Leggings', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Macacão', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Malas e Bolsas', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Moda Fitness', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Moda Praia', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Moda Íntima e Lingerie', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Roupas para Bebês', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Saias', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Ternos', commission: 14 },
  { category: 'Calçados, Roupas e Bolsas', subcategory: 'Vestidos', commission: 14 },

  // Câmeras e Acessórios - 11%
  { category: 'Câmeras e Acessórios', commission: 11 },
  { category: 'Câmeras e Acessórios', subcategory: 'Acessórios para Câmeras', commission: 11 },
  { category: 'Câmeras e Acessórios', subcategory: 'Cabos', commission: 11 },
  { category: 'Câmeras e Acessórios', subcategory: 'Câmeras', commission: 11 },
  { category: 'Câmeras e Acessórios', subcategory: 'Drones e Acessórios', commission: 11 },
  { category: 'Câmeras e Acessórios', subcategory: 'Equipamento de Revelação', commission: 11 },
  { category: 'Câmeras e Acessórios', subcategory: 'Filmadoras', commission: 11 },
  { category: 'Câmeras e Acessórios', subcategory: 'Instrumentos Ópticos', commission: 11 },
  { category: 'Câmeras e Acessórios', subcategory: 'Lentes e Filtros', commission: 11 },
  { category: 'Câmeras e Acessórios', subcategory: 'Peças para Câmeras', commission: 11 },
  { category: 'Câmeras e Acessórios', subcategory: 'Álbuns e Porta-retratos', commission: 11 },

  // Casa, Móveis e Decoração - 11.5%
  { category: 'Casa, Móveis e Decoração', commission: 11.5 },
  { category: 'Casa, Móveis e Decoração', subcategory: 'Cozinha', commission: 11.5 },
  { category: 'Casa, Móveis e Decoração', subcategory: 'Cuidado da Casa e Lavanderia', commission: 11.5 },
  { category: 'Casa, Móveis e Decoração', subcategory: 'Enfeites e Decoração da Casa', commission: 11.5 },
  { category: 'Casa, Móveis e Decoração', subcategory: 'Iluminação Residencial', commission: 11.5 },
  { category: 'Casa, Móveis e Decoração', subcategory: 'Instalações de Móveis', commission: 11.5 },
  { category: 'Casa, Móveis e Decoração', subcategory: 'Jardim e Ar Livre', commission: 11.5 },
  { category: 'Casa, Móveis e Decoração', subcategory: 'Móveis para Casa', commission: 11.5 },
  { category: 'Casa, Móveis e Decoração', subcategory: 'Organização para Casa', commission: 11.5 },
  { category: 'Casa, Móveis e Decoração', subcategory: 'Segurança para Casa', commission: 11.5 },
  { category: 'Casa, Móveis e Decoração', subcategory: 'Têxteis de Casa e Decoração', commission: 11.5 },

  // Celulares e Telefones - 11%
  { category: 'Celulares e Telefones', commission: 11 },
  { category: 'Celulares e Telefones', subcategory: 'Acessórios para Celulares', commission: 11 },
  { category: 'Celulares e Telefones', subcategory: 'Celulares e Smartphones', commission: 11 },
  { category: 'Celulares e Telefones', subcategory: 'Peças para Celular', commission: 11 },
  { category: 'Celulares e Telefones', subcategory: 'Rádio Comunicadores', commission: 11 },
  { category: 'Celulares e Telefones', subcategory: 'Smartwatches e Acessórios', commission: 11 },
  { category: 'Celulares e Telefones', subcategory: 'Tarifadores e Cabines', commission: 11 },
  { category: 'Celulares e Telefones', subcategory: 'Telefonia Fixa e Sem Fio', commission: 11 },
  { category: 'Celulares e Telefones', subcategory: 'VoIP', commission: 11 },
  { category: 'Celulares e Telefones', subcategory: 'Óculos', commission: 11 },

  // Construção - 11.5%
  { category: 'Construção', commission: 11.5 },
  { category: 'Construção', subcategory: 'Aberturas', commission: 11.5 },
  { category: 'Construção', subcategory: 'Acessórios de Construção', commission: 11.5 },
  { category: 'Construção', subcategory: 'Encanamento', commission: 11.5 },
  { category: 'Construção', subcategory: 'Energia', commission: 11.5 },
  { category: 'Construção', subcategory: 'Loja das Tintas', commission: 11.5 },
  { category: 'Construção', subcategory: 'Materiais de Obra', commission: 11.5 },
  { category: 'Construção', subcategory: 'Mobiliário para Banheiros', commission: 11.5 },
  { category: 'Construção', subcategory: 'Mobiliário para Cozinhas', commission: 11.5 },
  { category: 'Construção', subcategory: 'Máquinas para Construção', commission: 11.5 },

  // Eletrodomésticos - 11%
  { category: 'Eletrodomésticos', commission: 11 },
  { category: 'Eletrodomésticos', subcategory: 'Ar e Ventilação', commission: 11 },
  { category: 'Eletrodomésticos', subcategory: 'Bebedouros e Purificadores', commission: 11 },
  { category: 'Eletrodomésticos', subcategory: 'Cuidado Pessoal', commission: 11 },
  { category: 'Eletrodomésticos', subcategory: 'Fornos e Fogões', commission: 11 },
  { category: 'Eletrodomésticos', subcategory: 'Lavadores', commission: 11 },
  { category: 'Eletrodomésticos', subcategory: 'Pequenos Eletrodomésticos', commission: 11 },
  { category: 'Eletrodomésticos', subcategory: 'Refrigeração', commission: 11 },

  // Eletrônicos, Áudio e Vídeo - 13%
  { category: 'Eletrônicos, Áudio e Vídeo', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Acessórios para TV', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Acessórios para Áudio e Vídeo', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Aparelhos DVD e Bluray', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Bolsas e Estojos', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Cabos', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Componentes Eletrônicos', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Controles Remotos', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Drones e Acessórios', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Media Streaming', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Outros Eletrônicos', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Peças para TV', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Pilhas e Carregadores', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Projetores e Telas', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Televisores', commission: 13 },
  { category: 'Eletrônicos, Áudio e Vídeo', subcategory: 'Áudio', commission: 13 },

  // Esportes e Fitness - 12%
  { category: 'Esportes e Fitness', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Artes Marciais e Boxe', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Badminton', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Basquete', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Beisebol e Softbol', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Camping, Caça e Pesca', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Canoas, Caiaques e Infláveis', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Esgrima', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Esqui e Snowboard', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Fitness e Musculação', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Futebol', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Futebol Americano', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Golfe', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Handebol', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Hóquei', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Jogos de Salão', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Kitesurf', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Mergulho', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Moda Fitness', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Monitores Esportivos', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Natação', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Paintball', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Parapente', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Patinetes e Scooters', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Patim e Skateboard', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Pilates e Yoga', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Rapel, Montanhismo e Escalada', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Rugby', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Slackline', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Suplementos e Shakers', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Surf e Bodyboard', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Tiro Esportivo', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Tênis', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Tênis, Paddle e Squash', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Vôlei', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Wakeboard e Esqui Aquático', commission: 12 },
  { category: 'Esportes e Fitness', subcategory: 'Windsurfe', commission: 12 },

  // Ferramentas - 12%
  { category: 'Ferramentas', commission: 12 },
  { category: 'Ferramentas', subcategory: 'Acessórios para Ferramentas', commission: 12 },
  { category: 'Ferramentas', subcategory: 'Caixas e Organizadores', commission: 12 },

  // Games - 12%
  { category: 'Games', commission: 12 },
  { category: 'Games', subcategory: 'Acessórios para Consoles', commission: 12 },
  { category: 'Games', subcategory: 'Acessórios para PC Gaming', commission: 12 },
  { category: 'Games', subcategory: 'Consoles', commission: 12 },
  { category: 'Games', subcategory: 'Fliperamas e Arcade', commission: 12 },
  { category: 'Games', subcategory: 'Peças para Consoles', commission: 12 },
  { category: 'Games', subcategory: 'Video Games', commission: 12 },

  // Informática - 12%
  { category: 'Informática', commission: 12 },
  { category: 'Informática', subcategory: 'Acessórios de Antiestática', commission: 12 },
  { category: 'Informática', subcategory: 'Acessórios para PC Gaming', commission: 12 },
  { category: 'Informática', subcategory: 'Armazenamento', commission: 12 },
  { category: 'Informática', subcategory: 'Cabos e Hubs USB', commission: 12 },
  { category: 'Informática', subcategory: 'Componentes para PC', commission: 12 },
  { category: 'Informática', subcategory: 'Conectividade e Redes', commission: 12 },
  { category: 'Informática', subcategory: 'Criptomoedas', commission: 12 },
  { category: 'Informática', subcategory: 'Estabilizadores e No Breaks', commission: 12 },
  { category: 'Informática', subcategory: 'Gift Cards', commission: 12 },
  { category: 'Informática', subcategory: 'Impressão', commission: 12 },
  { category: 'Informática', subcategory: 'Leitores e Scanners', commission: 12 },
  { category: 'Informática', subcategory: 'Limpeza de PCs', commission: 12 },
  { category: 'Informática', subcategory: 'Monitores e Acessórios', commission: 12 },
  { category: 'Informática', subcategory: 'PC de Mesa', commission: 12 },
  { category: 'Informática', subcategory: 'Palms e Handhelds', commission: 12 },
  { category: 'Informática', subcategory: 'Periféricos para PC', commission: 12 },
  { category: 'Informática', subcategory: 'Portáteis e Acessórios', commission: 12 },
  { category: 'Informática', subcategory: 'Redes e Wi-Fi', commission: 12 },
  { category: 'Informática', subcategory: 'Softwares', commission: 12 },
  { category: 'Informática', subcategory: 'Suprimentos de Impressão', commission: 12 },
  { category: 'Informática', subcategory: 'Tablets e Acessórios', commission: 12 },

  // Instrumentos Musicais - 11.5%
  { category: 'Instrumentos Musicais', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Baterias e Percussão', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Caixas de Som', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Equipamento para DJs', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Estúdio de Gravação', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Instrumentos de Corda', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Instrumentos de Sopro', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Metrônomos', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Microfones e Amplificadores', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Partituras e Letras', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Pedais e Acessórios', commission: 11.5 },
  { category: 'Instrumentos Musicais', subcategory: 'Pianos e Teclados', commission: 11.5 },

  // Joias e Relógios - 14%
  { category: 'Joias e Relógios', commission: 14 },
  { category: 'Joias e Relógios', subcategory: 'Acessórios Para Relógios', commission: 14 },
  { category: 'Joias e Relógios', subcategory: 'Artigos de Joalharia', commission: 14 },
  { category: 'Joias e Relógios', subcategory: 'Canetas e Lapiseiras de Luxo', commission: 14 },
  { category: 'Joias e Relógios', subcategory: 'Joias e Bijuterias', commission: 14 },
  { category: 'Joias e Relógios', subcategory: 'Pedra Preciosa e Semipreciosa', commission: 14 },
  { category: 'Joias e Relógios', subcategory: 'Piercings', commission: 14 },
  { category: 'Joias e Relógios', subcategory: 'Porta Joias', commission: 14 },
  { category: 'Joias e Relógios', subcategory: 'Relógios', commission: 14 },

  // Saúde - 12%
  { category: 'Saúde', commission: 12 },
  { category: 'Saúde', subcategory: 'Cuidado da Saúde', commission: 12 },
  { category: 'Saúde', subcategory: 'Equipamento Médico', commission: 12 },
  { category: 'Saúde', subcategory: 'Massagem', commission: 12 },
  { category: 'Saúde', subcategory: 'Mobilidade', commission: 12 },
];

/**
 * Returns unique category names (top-level only, no duplicates)
 */
export function getUniqueCategories(): { label: string; commission: number }[] {
  const seen = new Set<string>();
  const result: { label: string; commission: number }[] = [];
  for (const item of ML_COMMISSIONS) {
    if (!item.subcategory && !seen.has(item.category)) {
      seen.add(item.category);
      result.push({ label: item.category, commission: item.commission });
    }
  }
  return result;
}

/**
 * Returns all searchable entries (category + subcategory) for autocomplete
 */
export function getSearchableEntries(): { label: string; fullLabel: string; commission: number }[] {
  const result: { label: string; fullLabel: string; commission: number }[] = [];
  const seenCategories = new Set<string>();

  for (const item of ML_COMMISSIONS) {
    if (!item.subcategory) {
      if (!seenCategories.has(item.category)) {
        seenCategories.add(item.category);
        result.push({
          label: item.category,
          fullLabel: item.category,
          commission: item.commission,
        });
      }
    } else {
      result.push({
        label: item.subcategory,
        fullLabel: `${item.category} › ${item.subcategory}`,
        commission: item.commission,
      });
    }
  }
  return result;
}
