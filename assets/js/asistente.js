/* =========================================================
   ASISTENTE DEL PORTAFOLIO
   Responde dudas sobre Francisco y ofrece contacto directo.

   Por qué no llama a una IA externa: este sitio es estático y
   se sirve desde GitHub Pages. Una clave de API metida en el
   JavaScript del navegador es pública — cualquiera puede leerla
   y gastarla. Y ante un reclutador, un modelo que improvisa
   sobre un CV es un riesgo, no una ventaja.

   Así que responde con hechos publicados en esta misma web:
   nada de lo que dice está inventado. Si no sabe algo, lo
   admite y ofrece escribir a Francisco.
   ========================================================= */
(function () {
  'use strict';

  var CORREO = 'franciscosarria96@gmail.com';
  var WHATSAPP = 'https://wa.me/351966424640';
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lang() {
    var l = document.documentElement.lang || 'es';
    return (l === 'pt' || l === 'en') ? l : 'es';
  }

  /* ---------------------------------------------------------
     Textos de la interfaz
     --------------------------------------------------------- */
  var UI = {
    es: {
      abrir: 'Abrir el asistente', cerrar: 'Cerrar el asistente',
      titulo: 'Asistente', estado: 'Resuelve dudas sobre mi trabajo',
      campo: 'Escribe tu pregunta…', enviar: 'Enviar',
      aviso: 'Respondo con la información publicada en esta web. Para lo demás, escribe a Francisco.',
      correo: 'Escribir un correo', wsp: 'Abrir WhatsApp', cv: 'Descargar el CV',
      verCaso: 'Ver el caso', verPort: 'Ver el portafolio', linkedin: 'Ver LinkedIn',
      corDir: 'Esta es su dirección:', copiar: 'Copiar', copiado: '¡Copiado!',
      gmail: 'Abrir en Gmail', outlook: 'Abrir en Outlook', appCorreo: 'Mi aplicación de correo',
      corPie: 'Si el botón de tu aplicación no responde, copia la dirección o usa el correo web.'
    },
    pt: {
      abrir: 'Abrir o assistente', cerrar: 'Fechar o assistente',
      titulo: 'Assistente', estado: 'Esclarece dúvidas sobre o meu trabalho',
      campo: 'Escreve a tua pergunta…', enviar: 'Enviar',
      aviso: 'Respondo com a informação publicada neste site. Para o resto, escreve ao Francisco.',
      correo: 'Escrever um email', wsp: 'Abrir WhatsApp', cv: 'Descarregar o CV',
      verCaso: 'Ver o caso', verPort: 'Ver o portefólio', linkedin: 'Ver LinkedIn',
      corDir: 'Este é o endereço dele:', copiar: 'Copiar', copiado: 'Copiado!',
      gmail: 'Abrir no Gmail', outlook: 'Abrir no Outlook', appCorreo: 'A minha aplicação de email',
      corPie: 'Se o botão da tua aplicação não responder, copia o endereço ou usa o email web.'
    },
    en: {
      abrir: 'Open the assistant', cerrar: 'Close the assistant',
      titulo: 'Assistant', estado: 'Answers questions about my work',
      campo: 'Type your question…', enviar: 'Send',
      aviso: 'I answer with the information published on this site. For anything else, write to Francisco.',
      correo: 'Send an email', wsp: 'Open WhatsApp', cv: 'Download the CV',
      verCaso: 'See the case', verPort: 'See the portfolio', linkedin: 'View LinkedIn',
      corDir: 'This is his address:', copiar: 'Copy', copiado: 'Copied!',
      gmail: 'Open in Gmail', outlook: 'Open in Outlook', appCorreo: 'My mail app',
      corPie: 'If your app button does nothing, copy the address or use webmail.'
    }
  };

  /* ---------------------------------------------------------
     Base de conocimiento
     Cada tema: claves de búsqueda + respuesta + acciones.
     Todo sale de lo que ya está publicado en el sitio.
     --------------------------------------------------------- */
  var TEMAS = [
    {
      id: 'servicios',
      c: {
        es: 'servicios ofrece hacer puede ayudar necesito quiero encargar tipo trabajos acepta especialidad',
        pt: 'servicos oferece fazer pode ajudar preciso quero encomendar tipo trabalhos aceita especialidade',
        en: 'services offer help need commission type work accepts speciality specialty capabilities'
      },
      r: {
        es: 'Cuatro frentes: sitios web en WordPress o a medida; identidad de marca, editorial e impresos; contenido para redes y YouTube con su estrategia; y producción audiovisual, incluida música y vídeo. Cuéntale qué necesitas y te dice si encaja.',
        pt: 'Quatro frentes: sites em WordPress ou à medida; identidade de marca, editorial e impressos; conteúdo para redes e YouTube com a sua estratégia; e produção audiovisual, incluindo música e vídeo. Diz-lhe o que precisas e ele diz-te se encaixa.',
        en: 'Four fronts: WordPress or bespoke websites; brand identity, editorial and print; social and YouTube content with its strategy; and audiovisual production, music and video included. Tell him what you need and he will say whether it fits.'
      },
      a: ['port', 'mail']
    },
    {
      id: 'proceso',
      c: {
        es: 'proceso metodologia metodo trabaja forma pasos empezar arranca briefing revisiones entrega flujo',
        pt: 'processo metodologia metodo trabalha forma passos comecar briefing revisoes entrega fluxo',
        en: 'process methodology how works method steps start briefing revisions delivery approach'
      },
      r: {
        es: 'Siempre igual: entiende el objetivo, diseña para ese objetivo y revisa los resultados. Lo que entrega está pensado para que funcione sin él después — como el sistema de plantillas de Proclade, que dejó al equipo publicando solo.',
        pt: 'Sempre igual: percebe o objetivo, desenha para esse objetivo e revê os resultados. O que entrega está pensado para funcionar sem ele depois — como o sistema de modelos da Proclade, que deixou a equipa a publicar sozinha.',
        en: 'Always the same: understand the goal, design for that goal, review the results. What he delivers is built to work without him afterwards — like the Proclade template system, which left the team publishing on their own.'
      },
      a: ['proclade', 'port']
    },
    {
      id: 'resultados',
      c: {
        es: 'resultados metricas cifras numeros datos logros exito funciona demostrado medible impacto',
        pt: 'resultados metricas numeros dados conquistas exito funciona demonstrado mensuravel impacto',
        en: 'results metrics figures numbers data achievements success proven measurable impact'
      },
      r: {
        es: 'Los que puede enseñar: Elum Tarot de cero a 32,4 K seguidores y 4,04 M de visualizaciones en noventa días; El Jardín de las Diosas monetizado en cinco meses, con 3,69 M de reproducciones; treinta vídeos en cinco meses en Kiara y Dorian; y dos sitios institucionales que siguen en producción.',
        pt: 'Os que pode mostrar: Elum Tarot de zero a 32,4 K seguidores e 4,04 M de visualizações em noventa dias; El Jardín de las Diosas monetizado em cinco meses, com 3,69 M de reproduções; trinta vídeos em cinco meses em Kiara e Dorian; e dois sites institucionais que continuam em produção.',
        en: 'The ones he can show: Elum Tarot from zero to 32.4K followers and 4.04M views in ninety days; El Jardín de las Diosas monetised in five months with 3.69M views; thirty videos in five months on Kiara and Dorian; and two institutional sites still in production.'
      },
      a: ['port']
    },
    {
      id: 'porque',
      c: {
        es: 'porque contratarlo diferencia mejor ventaja aporta destaca fuerte bueno recomienda',
        pt: 'porque contratar diferenca melhor vantagem traz destaca forte bom recomenda',
        en: 'why hire difference better advantage brings stands out strong good recommend'
      },
      r: {
        es: 'Porque cubre el recorrido entero: la idea, el diseño, el desarrollo y la medición del resultado. Los cuatro casos del portafolio los llevó de principio a fin él solo, y todos siguen vivos hoy.',
        pt: 'Porque cobre o percurso inteiro: a ideia, o design, o desenvolvimento e a medição do resultado. Os quatro casos do portefólio levou-os de ponta a ponta sozinho, e todos continuam vivos hoje.',
        en: 'Because he covers the whole run: the idea, the design, the build and the measurement. He took all four portfolio cases end to end on his own, and all of them are still alive today.'
      },
      a: ['port', 'mail']
    },
    {
      id: 'audiovisual',
      c: {
        es: 'video videos foto fotografia audiovisual grabar editar montaje musica cancion audio podcast spotify sonido',
        pt: 'video videos foto fotografia audiovisual gravar editar montagem musica cancao audio podcast spotify som',
        en: 'video videos photo photography audiovisual record edit editing music song audio podcast spotify sound'
      },
      r: {
        es: 'Sí: graba y edita vídeo, hace fotografía y produce audio. En Kiara y Dorian compuso la música y montó los treinta vídeos; en el sitio de CMF integró un podcast que editó él mismo.',
        pt: 'Sim: grava e edita vídeo, faz fotografia e produz áudio. Em Kiara e Dorian compôs a música e montou os trinta vídeos; no site da CMF integrou um podcast que editou ele mesmo.',
        en: 'Yes — he shoots and edits video, does photography and produces audio. On Kiara and Dorian he wrote the music and cut all thirty videos; on the CMF site he embedded a podcast he edited himself.'
      },
      a: ['kiara', 'proclade']
    },
    {
      id: 'sistema',
      c: {
        es: 'sistema manual identidad guia estilo paleta tipografia logotipo normas coherencia',
        pt: 'sistema manual identidade guia estilo paleta tipografia logotipo normas coerencia',
        en: 'system manual identity guide style palette typography logotype rules consistency'
      },
      r: {
        es: 'Trabaja con sistema, no pieza a pieza. El manual de Elum Tarot tiene catorce láminas: símbolo, paleta, tipografía y reglas de uso. De ahí salieron 361 publicaciones, 22 cartas y la web, todas coherentes entre sí. Puedes verlo entero en el caso.',
        pt: 'Trabalha com sistema, não peça a peça. O manual da Elum Tarot tem catorze pranchas: símbolo, paleta, tipografia e regras de uso. Daí saíram 361 publicações, 22 cartas e o site, todas coerentes entre si. Podes vê-lo inteiro no caso.',
        en: 'He works with a system, not piece by piece. The Elum Tarot manual has fourteen boards: symbol, palette, type and rules of use. Out of it came 361 posts, 22 cards and the website, all consistent. You can see it in full in the case.'
      },
      a: ['elum']
    },
    {
      id: 'clientes',
      c: {
        es: 'clientes sectores empresas rubro industria ong marcas para quien trabajado referencias',
        pt: 'clientes setores empresas ramo industria ong marcas para quem trabalhou referencias',
        en: 'clients sectors companies industry ngo brands who has worked references'
      },
      r: {
        es: 'Ha trabajado con una ONGD internacional (Proclade Colven y CMF Colven), con marcas propias en tarot y música espiritual, y como freelance en sectores diversos desde 2017.',
        pt: 'Trabalhou com uma ONGD internacional (Proclade Colven e CMF Colven), com marcas próprias em tarot e música espiritual, e como freelancer em setores diversos desde 2017.',
        en: 'He has worked with an international NGO (Proclade Colven and CMF Colven), with his own brands in tarot and spiritual music, and freelance across varied sectors since 2017.'
      },
      a: ['proclade', 'port']
    },
    {
      id: 'ayuda',
      c: {
        es: 'ayuda ayudame responder preguntar temas opciones menu inicio hola buenas',
        pt: 'ajuda ajudame que podes responder perguntar temas opcoes menu inicio ola boas',
        en: 'help what can you answer ask topics options menu start hello hi'
      },
      r: {
        es: 'Puedo hablarte de su experiencia y formación, de lo que sabe hacer, de cada uno de los cuatro casos, de disponibilidad, precios y plazos, y de cómo contactarle. Pregunta lo que quieras.',
        pt: 'Posso falar-te da sua experiência e formação, do que sabe fazer, de cada um dos quatro casos, de disponibilidade, preços e prazos, e de como o contactar. Pergunta o que quiseres.',
        en: 'I can tell you about his experience and education, what he can do, each of the four cases, availability, pricing and timing, and how to reach him. Ask whatever you like.'
      },
      a: ['port', 'mail']
    },
    {
      id: 'quien',
      c: {
        es: 'quien eres quien es francisco sobre ti presentate presentacion perfil diseñador que haces a que te dedicas',
        pt: 'quem es quem e francisco sobre ti apresenta perfil designer que fazes',
        en: 'who is francisco introduce introduction profile designer bio background person'
      },
      r: {
        es: 'Francisco Sarria es diseñador de producto digital y web, colombiano, afincado en Oporto. Más de ocho años de oficio: empezó en identidad de marca e impresos y hoy lleva un proyecto entero, del concepto y el sistema visual a la interfaz, la implementación y la documentación. Identidad, UX/UI, desarrollo en WordPress y herramientas a medida con IA aplicada.',
        pt: 'Francisco Sarria é designer de produto digital e web, colombiano, radicado no Porto. Mais de oito anos de ofício: começou em identidade de marca e impressos e hoje leva um projeto inteiro, do conceito e do sistema visual à interface, à implementação e à documentação. Identidade, UX/UI, desenvolvimento em WordPress e ferramentas à medida com IA aplicada.',
        en: 'Francisco Sarria is a digital product and web designer, Colombian, based in Porto. Over eight years in the trade: he started in brand identity and print and today takes a whole project from the concept and the visual system through to the interface, the build and the documentation. Identity, UX/UI, WordPress development and custom tools with applied AI.'
      },
      a: ['port', 'cv']
    },
    {
      id: 'contacto',
      c: {
        es: 'contacto contactar contactarte contactarlo hablar escribir correo email mail whatsapp telefono llamar mensaje contratar reunion',
        pt: 'contacto contactar falar escrever email correio whatsapp telefone ligar mensagem orcamento contratar trabalhar juntos reuniao',
        en: 'contact email mail whatsapp phone call message hire quote work together meeting reach'
      },
      r: {
        es: 'Por correo o por WhatsApp, como prefieras. Francisco responde a propuestas de proyecto, colaboraciones y ofertas de trabajo, y contesta con una primera idea de alcance y plazos.',
        pt: 'Por email ou por WhatsApp, como preferires. O Francisco responde a propostas de projeto, colaborações e ofertas de trabalho, e responde com uma primeira ideia de âmbito e prazos.',
        en: 'By email or WhatsApp, whichever you prefer. Francisco answers project proposals, collaborations and job offers, and replies with a first read on scope and timing.'
      },
      a: ['mail', 'wsp']
    },
    {
      id: 'disponible',
      c: {
        es: 'disponible disponibilidad libre ocupado empezar cuando aceptas freelance jornada contrato remoto presencial hibrido trabajar trabajo contratando vacante',
        pt: 'disponivel disponibilidade livre ocupado comecar quando aceita freelance contrato remoto presencial hibrido trabalhar trabalho vaga',
        en: 'available availability free busy start when accept freelance contract remote onsite hybrid hiring vacancy'
      },
      r: {
        es: 'Sí: disponible para proyectos. Trabaja como freelance y también en plantilla, en remoto, presencial en Oporto o híbrido.',
        pt: 'Sim: disponível para projetos. Trabalha como freelancer e também por conta de outrem, em remoto, presencial no Porto ou híbrido.',
        en: 'Yes — available for projects. He works freelance and also employed, remotely, on-site in Porto or hybrid.'
      },
      a: ['mail', 'wsp']
    },
    {
      id: 'donde',
      c: {
        es: 'donde vive ubicacion ciudad pais oporto porto portugal reubicacion mudarse zona horaria viaja',
        pt: 'onde vive localizacao cidade pais porto portugal mudanca fuso horario viaja',
        en: 'where live location city country porto portugal relocate timezone travel based'
      },
      r: {
        es: 'En Oporto, Portugal. Trabaja en remoto con clientes de cualquier sitio y presencialmente en la zona.',
        pt: 'No Porto, Portugal. Trabalha em remoto com clientes de qualquer lugar e presencialmente na zona.',
        en: 'In Porto, Portugal. He works remotely with clients anywhere and on-site in the area.'
      },
      a: ['mail']
    },
    {
      id: 'experiencia',
      c: {
        es: 'experiencia años trayectoria carrera curriculum cv historial puestos empresas donde ha trabajado senior',
        pt: 'experiencia anos trajetoria carreira curriculo cv historico cargos empresas onde trabalhou senior',
        en: 'experience years career resume cv background roles companies worked senior'
      },
      r: {
        es: 'Más de ocho años. Tres etapas: estrategia de contenido digital e IA (2024—2026), diseño web y WordPress para la ONGD Proclade Colven en Medellín (2022—2024), y diseño creativo freelance desde 2017.',
        pt: 'Mais de oito anos. Três etapas: estratégia de conteúdo digital e IA (2024—2026), design web e WordPress para a ONGD Proclade Colven em Medellín (2022—2024), e design criativo freelance desde 2017.',
        en: 'Over eight years. Three stages: digital content and AI strategy (2024—2026), web design and WordPress for the NGO Proclade Colven in Medellín (2022—2024), and freelance creative design since 2017.'
      },
      a: ['cv', 'linkedin']
    },
    {
      id: 'web',
      c: {
        es: 'web wordpress elementor woocommerce desarrollo programar codigo html css tienda ecommerce landing pagina responsive sitio',
        pt: 'web wordpress elementor woocommerce desenvolvimento programar codigo html css loja ecommerce landing pagina responsive site',
        en: 'web wordpress elementor woocommerce development code html css shop ecommerce landing page responsive site build'
      },
      r: {
        es: 'Sitios en WordPress con Elementor y WooCommerce cuando hace falta tienda, siempre responsive y con mantenimiento posterior. También construye webs a medida: la de Elum Tarot es suya de principio a fin, con formularios, una herramienta interactiva y un asistente conversacional.',
        pt: 'Sites em WordPress com Elementor e WooCommerce quando é preciso loja, sempre responsive e com manutenção posterior. Também constrói sites à medida: o da Elum Tarot é dele de ponta a ponta, com formulários, uma ferramenta interativa e um assistente conversacional.',
        en: 'WordPress sites with Elementor, and WooCommerce when a shop is needed — always responsive, with maintenance afterwards. He also builds bespoke sites: the Elum Tarot one is his end to end, with forms, an interactive tool and a conversational assistant.'
      },
      a: ['elum', 'proclade']
    },
    {
      id: 'diseno',
      c: {
        es: 'diseño grafico identidad marca branding logo editorial impresos photoshop illustrator indesign lightroom premiere capcut canva retoque maquetacion edicion herramientas programas software adobe',
        pt: 'design grafico identidade marca branding logotipo editorial impressos photoshop illustrator indesign lightroom premiere capcut canva retoque paginacao edicao ferramentas programas software adobe',
        en: 'graphic design identity brand branding logo editorial print photoshop illustrator indesign lightroom premiere capcut canva retouch layout editing tools programs software adobe'
      },
      r: {
        es: 'Identidad de marca, editorial e impresos, más retoque, fotografía y edición de vídeo. Herramientas: Photoshop, Illustrator, InDesign, Lightroom, Premiere, CapCut y Canva.',
        pt: 'Identidade de marca, editorial e impressos, mais retoque, fotografia e edição de vídeo. Ferramentas: Photoshop, Illustrator, InDesign, Lightroom, Premiere, CapCut e Canva.',
        en: 'Brand identity, editorial and print, plus retouching, photography and video editing. Tools: Photoshop, Illustrator, InDesign, Lightroom, Premiere, CapCut and Canva.'
      },
      a: ['elum', 'port']
    },
    {
      id: 'ia',
      c: {
        es: 'ia inteligencia artificial automatizacion generativa modelos prompts imagenes generadas',
        pt: 'ia inteligencia artificial automacao generativa modelos prompts imagens geradas',
        en: 'ai artificial intelligence automation generative models prompts generated images'
      },
      r: {
        es: 'La usa como parte del proceso de producción, no como atajo. En el caso de Kiara y Dorian levantó dos intérpretes con rostro y voz consistentes a lo largo de treinta vídeos, con un sistema de hojas de personaje y prompts fijos. El criterio y la dirección siguen siendo suyos.',
        pt: 'Usa-a como parte do processo de produção, não como atalho. No caso da Kiara e do Dorian levantou dois intérpretes com rosto e voz consistentes ao longo de trinta vídeos, com um sistema de folhas de personagem e prompts fixos. O critério e a direção continuam a ser dele.',
        en: 'He uses it as part of the production process, not as a shortcut. In the Kiara and Dorian case he built two performers with a consistent face and voice across thirty videos, using character sheets and fixed prompts. The judgement and direction stay his.'
      },
      a: ['kiara']
    },
    {
      id: 'marketing',
      c: {
        es: 'marketing redes sociales instagram youtube meta ads google ads seo analitica community campañas publicidad crecimiento audiencia',
        pt: 'marketing redes sociais instagram youtube meta ads google ads seo analitica community campanhas publicidade crescimento audiencia',
        en: 'marketing social media instagram youtube meta ads google ads seo analytics community campaigns advertising growth audience'
      },
      r: {
        es: 'Meta Ads, Google Ads, SEO, analítica y gestión de comunidad. Con resultados propios: Elum Tarot de cero a 32,4 K seguidores, y El Jardín de las Diosas hasta 3,69 M de reproducciones y monetización en cinco meses.',
        pt: 'Meta Ads, Google Ads, SEO, analítica e gestão de comunidade. Com resultados próprios: Elum Tarot de zero a 32,4 K seguidores, e El Jardín de las Diosas até 3,69 M de reproduções e monetização em cinco meses.',
        en: 'Meta Ads, Google Ads, SEO, analytics and community management. With results of his own: Elum Tarot from zero to 32.4K followers, and El Jardín de las Diosas to 3.69M views and monetisation in five months.'
      },
      a: ['elum', 'jardin']
    },
    {
      id: 'idiomas',
      c: {
        es: 'idiomas lenguas habla español portugues ingles nivel',
        pt: 'idiomas linguas fala espanhol portugues ingles nivel',
        en: 'languages speak spanish portuguese english level fluent'
      },
      r: {
        es: 'Español nativo, portugués avanzado e inglés intermedio.',
        pt: 'Espanhol nativo, português avançado e inglês intermédio.',
        en: 'Native Spanish, advanced Portuguese and intermediate English.'
      },
      a: ['mail']
    },
    {
      id: 'formacion',
      c: {
        es: 'formacion estudios titulo carrera universidad licenciatura certificaciones cursos estudio donde',
        pt: 'formacao estudos grau curso universidade licenciatura certificacoes cursos estudou onde',
        en: 'education studies degree university bachelor certifications courses studied where'
      },
      r: {
        es: 'Licenciatura en Diseño Visual por la Institución Universitaria Colegio Mayor del Cauca, Colombia (2022). Además, certificaciones de desarrollo web de Google Actívate y formación en Photoshop del SENA.',
        pt: 'Licenciatura em Design Visual pela Institución Universitaria Colegio Mayor del Cauca, Colômbia (2022). Além disso, certificações de desenvolvimento web do Google Actívate e formação em Photoshop do SENA.',
        en: 'A degree in Visual Design from Institución Universitaria Colegio Mayor del Cauca, Colombia (2022). Plus web development certifications from Google Actívate and Photoshop training from SENA.'
      },
      a: ['cv']
    },
    {
      id: 'cv',
      c: {
        es: 'cv curriculum hoja de vida resume descargar pdf documento adjuntar',
        pt: 'cv curriculo resume descarregar pdf documento anexar',
        en: 'cv resume download pdf document attach'
      },
      r: {
        es: 'Puedes descargar el CV completo en PDF. Hay también una versión en .docx pensada para sistemas de selección automáticos.',
        pt: 'Podes descarregar o CV completo em PDF. Há também uma versão em .docx pensada para sistemas de seleção automáticos.',
        en: 'You can download the full CV as a PDF. There is also a .docx version made for automated screening systems.'
      },
      a: ['cv', 'mail']
    },
    {
      id: 'elum',
      c: {
        es: 'elum tarot marca comunidad instagram seguidores landing arcanos mazo cartas identidad',
        pt: 'elum tarot marca comunidade instagram seguidores landing arcanos baralho cartas identidade',
        en: 'elum tarot brand community instagram followers landing arcana deck cards identity'
      },
      r: {
        es: 'Elum Tarot: de cero a 32,4 K seguidores en Instagram, 4,04 M de visualizaciones en noventa días y una web de ventas propia. Incluye manual de identidad, 22 arcanos diseñados y una herramienta interactiva con asistente.',
        pt: 'Elum Tarot: de zero a 32,4 K seguidores no Instagram, 4,04 M de visualizações em noventa dias e um site de vendas próprio. Inclui manual de identidade, 22 arcanos desenhados e uma ferramenta interativa com assistente.',
        en: 'Elum Tarot: from zero to 32.4K Instagram followers, 4.04M views in ninety days and a sales site of its own. It includes an identity manual, 22 designed arcana and an interactive tool with an assistant.'
      },
      a: ['elum']
    },
    {
      id: 'kiara',
      c: {
        es: 'kiara dorian musica cantante bolero jazz soul personajes videos youtube canciones',
        pt: 'kiara dorian musica cantora bolero jazz soul personagens videos youtube cancoes',
        en: 'kiara dorian music singer bolero jazz soul characters videos youtube songs'
      },
      r: {
        es: 'Kiara Soul Music y Dorian Ferrer: dos intérpretes creados desde cero, treinta vídeos en cinco meses, con rostro y voz sostenidos pieza a pieza. Francisco diseñó los personajes, compuso la música y produjo cada vídeo.',
        pt: 'Kiara Soul Music e Dorian Ferrer: dois intérpretes criados de raiz, trinta vídeos em cinco meses, com rosto e voz sustentados peça a peça. O Francisco desenhou as personagens, compôs a música e produziu cada vídeo.',
        en: 'Kiara Soul Music and Dorian Ferrer: two performers created from scratch, thirty videos in five months, with face and voice held steady piece by piece. Francisco designed the characters, wrote the music and produced every video.'
      },
      a: ['kiara']
    },
    {
      id: 'jardin',
      c: {
        es: 'jardin diosas canal youtube monetizado reproducciones miniaturas playlists musica espiritual',
        pt: 'jardim deusas canal youtube monetizado reproducoes miniaturas playlists musica espiritual',
        en: 'jardin goddesses channel youtube monetised views thumbnails playlists spiritual music'
      },
      r: {
        es: 'El Jardín de las Diosas: canal de YouTube levantado desde cero, monetizado en cinco meses y aún facturando. 157 vídeos, 3,69 M de reproducciones y un catálogo que sostiene unas 250.000 al mes.',
        pt: 'El Jardín de las Diosas: canal de YouTube construído de raiz, monetizado em cinco meses e ainda a faturar. 157 vídeos, 3,69 M de reproduções e um catálogo que sustenta cerca de 250.000 por mês.',
        en: 'El Jardín de las Diosas: a YouTube channel built from scratch, monetised in five months and still earning. 157 videos, 3.69M views and a catalogue holding around 250,000 a month.'
      },
      a: ['jardin']
    },
    {
      id: 'proclade',
      c: {
        es: 'proclade cmf ongd institucional claretianos plantillas cliente colombia venezuela',
        pt: 'proclade cmf ongd institucional claretianos modelos cliente colombia venezuela',
        en: 'proclade cmf ngo institutional claretians templates client colombia venezuela'
      },
      r: {
        es: 'Proclade + CMF: dos sitios institucionales en WordPress, con un sistema de plantillas que dejó al equipo publicando sin ayuda técnica. Más de tres años después la relación sigue activa.',
        pt: 'Proclade + CMF: dois sites institucionais em WordPress, com um sistema de modelos que deixou a equipa a publicar sem ajuda técnica. Mais de três anos depois a relação continua ativa.',
        en: 'Proclade + CMF: two institutional WordPress sites, with a template system that left the team publishing without technical help. More than three years on, the relationship is still active.'
      },
      a: ['proclade']
    },
    {
      id: 'portafolio',
      c: {
        es: 'portafolio proyectos casos trabajos ejemplos muestras ver trabajo',
        pt: 'portefolio projetos casos trabalhos exemplos amostras ver trabalho',
        en: 'portfolio projects cases work examples samples see work'
      },
      r: {
        es: 'Hay cuatro casos completos, cada uno con el problema, lo que diseñó y lo que cambió: Elum Tarot, Kiara y Dorian, El Jardín de las Diosas, y Proclade + CMF.',
        pt: 'Há quatro casos completos, cada um com o problema, o que desenhou e o que mudou: Elum Tarot, Kiara e Dorian, El Jardín de las Diosas, e Proclade + CMF.',
        en: 'There are four full case studies, each with the problem, what he designed and what changed: Elum Tarot, Kiara and Dorian, El Jardín de las Diosas, and Proclade + CMF.'
      },
      a: ['port']
    },
    {
      id: 'precio',
      c: {
        es: 'precio precios tarifa tarifas cuanto cuesta cobra presupuesto coste honorarios pago factura hora',
        pt: 'preco precos tarifa quanto custa cobra orcamento custo honorarios pagamento fatura hora',
        en: 'price prices rate rates how much cost charge quote fee payment invoice hourly budget'
      },
      r: {
        es: 'No hay tarifa fija publicada: depende del alcance. Cuéntale qué necesitas por correo o WhatsApp y te contesta con una primera idea de alcance y plazos.',
        pt: 'Não há tarifa fixa publicada: depende do âmbito. Diz-lhe o que precisas por email ou WhatsApp e responde-te com uma primeira ideia de âmbito e prazos.',
        en: 'There is no fixed published rate — it depends on scope. Tell him what you need by email or WhatsApp and he will come back with a first read on scope and timing.'
      },
      a: ['mail', 'wsp']
    },
    {
      id: 'plazos',
      c: {
        es: 'plazo plazos tiempo tarda cuanto dura entrega urgencia rapido calendario',
        pt: 'prazo prazos tempo demora quanto dura entrega urgencia rapido calendario',
        en: 'deadline timeline time take how long delivery urgent fast schedule'
      },
      r: {
        es: 'También depende del alcance. Si le escribes con lo que tienes en mente, te contesta con una primera idea de alcance y plazos.',
        pt: 'Também depende do âmbito. Se lhe escreveres com o que tens em mente, responde-te com uma primeira ideia de âmbito e prazos.',
        en: 'That depends on scope too. Write to him with what you have in mind and he will reply with a first read on scope and timing.'
      },
      a: ['mail', 'wsp']
    },
    {
      id: 'linkedin',
      c: {
        es: 'linkedin red profesional perfil social github',
        pt: 'linkedin rede profissional perfil social github',
        en: 'linkedin professional network profile social github'
      },
      r: {
        es: 'Su perfil profesional está en LinkedIn.',
        pt: 'O perfil profissional está no LinkedIn.',
        en: 'His professional profile is on LinkedIn.'
      },
      a: ['linkedin', 'mail']
    },
    {
      id: 'gracias',
      c: {
        es: 'gracias muchas gracias genial perfecto vale adios hasta luego chao',
        pt: 'obrigado obrigada otimo perfeito adeus ate logo',
        en: 'thanks thank you great perfect bye goodbye cheers'
      },
      r: {
        es: 'A ti. Si quieres seguir la conversación con Francisco, aquí tienes las dos vías.',
        pt: 'De nada. Se quiseres continuar a conversa com o Francisco, aqui tens as duas vias.',
        en: 'Any time. If you want to carry on with Francisco directly, here are both ways.'
      },
      a: ['mail', 'wsp']
    }
  ];

  /* ---------------------------------------------------------
     Acciones que puede ofrecer una respuesta
     --------------------------------------------------------- */
  function acciones(l) {
    return {
      mail: { t: UI[l].correo, tarjeta: 1, p: 1 },
      wsp: { t: UI[l].wsp, h: WHATSAPP, ext: 1, p: 1 },
      cv: { t: UI[l].cv, h: 'assets/docs/CV-Francisco-Sarria-2026.pdf', dl: 1 },
      port: { t: UI[l].verPort, h: 'portafolio.html' },
      linkedin: { t: UI[l].linkedin, h: 'https://www.linkedin.com/in/francisco-sarria-528048232/', ext: 1 },
      elum: { t: 'Elum Tarot', h: 'elum.html' },
      kiara: { t: 'Kiara & Dorian', h: 'kiara-dorian.html' },
      jardin: { t: 'El Jardín de las Diosas', h: 'jardin.html' },
      proclade: { t: 'Proclade + CMF', h: 'proclade-cmf.html' }
    };
  }

  /* ---------------------------------------------------------
     Búsqueda: se normaliza, se parte en palabras y se puntúa
     cuántas coinciden con las claves de cada tema.
     --------------------------------------------------------- */
  function normalizar(t) {
    return (t || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9ñ\s]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  var VACIAS = ' de la el los las un una y o que en con por para a al del me te se su tu mi es son esta este esa ese como cual cuales sobre quiero quiere puede podria hay muy mas the of and to in for is are do does you your i what how can about tell give know his him her its this that with more some very '
    .split(' ').filter(Boolean);

  // cuantos temas usan cada palabra: cuanto mas comun, menos identifica
  var frecuencia = {};
  (function () {
    ['es', 'pt', 'en'].forEach(function (l) {
      frecuencia[l] = {};
      TEMAS.forEach(function (tema) {
        var vistas = {};
        normalizar(tema.c[l] || tema.c.es).split(' ').forEach(function (k) {
          if (!k || vistas[k]) return;
          vistas[k] = 1;
          frecuencia[l][k] = (frecuencia[l][k] || 0) + 1;
        });
      });
    });
  })();

  // «casos» y «caso» son la misma palabra: se compara sin el plural
  function raiz(w) {
    // «colores» -> «color», pero «haces» -> «hace», no «hac»
    if (w.length > 5 && /es$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w)) return w.slice(0, -1);
    return w;
  }

  function peso(k, l) {
    var n = (frecuencia[l] && frecuencia[l][k]) || 1;
    var base = n === 1 ? 3 : (n === 2 ? 1.6 : 0.8);
    // «wordpress» identifica mas que «hacer», aunque las dos sean unicas
    return base * (1 + Math.min(k.length, 12) / 40);
  }

  function buscar(texto, l) {
    var palabras = normalizar(texto).split(' ')
      .filter(function (p) { return p.length > 2 && VACIAS.indexOf(p) === -1; });
    if (!palabras.length) return null;

    var mejor = null, mejorP = 0;
    TEMAS.forEach(function (tema) {
      var claves = normalizar(tema.c[l] || tema.c.es).split(' ');
      var p = 0;
      palabras.forEach(function (w) {
        var suma = 0;
        for (var i = 0; i < claves.length; i++) {
          var k = claves[i];
          if (!k) continue;
          if (k === w || raiz(k) === raiz(w)) { suma = peso(k, l); break; }
          // misma raiz: «escribo» y «escribir», «contacto» y «contactar»
          if (w.length > 4 && k.length > 4 && w.slice(0, 5) === k.slice(0, 5)) {
            suma = Math.max(suma, peso(k, l) * 0.9);
          }
        }
        p += suma;
      });
      if (p > mejorP + 0.01) { mejorP = p; mejor = tema; }
    });
    // una pregunta de una sola palabra no puede sumar tanto como una larga
    var umbral = palabras.length === 1 ? 1.8 : 3;
    return mejorP >= umbral ? mejor : null;
  }

  // cuando no llega al umbral, los temas que mas se acercaron
  function cercanos(texto, l) {
    var palabras = normalizar(texto).split(' ')
      .filter(function (p) { return p.length > 2 && VACIAS.indexOf(p) === -1; });
    var puntos = [];
    TEMAS.forEach(function (tema) {
      if (tema.id === 'ayuda' || tema.id === 'gracias') return;
      var claves = normalizar(tema.c[l] || tema.c.es).split(' ');
      var p = 0;
      palabras.forEach(function (w) {
        for (var i = 0; i < claves.length; i++) {
          if (claves[i] && (claves[i] === w || raiz(claves[i]) === raiz(w))) { p += 1; break; }
        }
      });
      puntos.push({ tema: tema, p: p });
    });
    puntos.sort(function (a, b) { return b.p - a.p; });
    // si nada se parecio, se ofrecen los temas de entrada
    var top = puntos.filter(function (o) { return o.p > 0; }).slice(0, 3);
    if (!top.length) {
      top = ['servicios', 'resultados', 'contacto'].map(function (id) {
        return { tema: porId(id), p: 0 };
      });
    }
    return top.map(function (o) { return o.tema; });
  }

  function porId(id) {
    for (var i = 0; i < TEMAS.length; i++) if (TEMAS[i].id === id) return TEMAS[i];
    return null;
  }

  /* ---------------------------------------------------------
     Interfaz
     --------------------------------------------------------- */
  var panel, hilo, form, campo, lanzador, abierto = false, ultimoFoco = null;

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt) n.textContent = txt;
    return n;
  }

  function construir() {
    var l = lang();

    lanzador = el('button', 'as-lanzador');
    lanzador.type = 'button';
    lanzador.setAttribute('aria-label', UI[l].abrir);
    lanzador.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v11H9l-5 3.5z"/>' +
      '<circle cx="9" cy="11" r="1.1"/><circle cx="12" cy="11" r="1.1"/><circle cx="15" cy="11" r="1.1"/></svg>';
    document.body.appendChild(lanzador);

    panel = el('aside', 'as');
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', UI[l].titulo);
    panel.innerHTML =
      '<header class="as-cab">' +
        '<span class="as-marca" aria-hidden="true">FS</span>' +
        '<span class="as-id"><b class="as-tit"></b><span class="as-est"></span></span>' +
        '<button class="as-cerrar" type="button">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</header>' +
      '<div class="as-hilo" role="log" aria-live="polite"></div>' +
      '<form class="as-pie">' +
        '<input class="as-campo" type="text" autocomplete="off" maxlength="200">' +
        '<button class="as-enviar" type="submit">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-7-7 16-2-7z"/></svg></button>' +
      '</form>' +
      '<p class="as-aviso"></p>';
    document.body.appendChild(panel);

    hilo = panel.querySelector('.as-hilo');
    form = panel.querySelector('.as-pie');
    campo = panel.querySelector('.as-campo');

    lanzador.addEventListener('click', alternar);
    panel.querySelector('.as-cerrar').addEventListener('click', cerrar);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = campo.value.trim();
      if (!t) return;
      campo.value = '';
      preguntar(t);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && abierto) { e.preventDefault(); cerrar(); }
    });

    pintarTextos();

    // se recupera la conversacion de la pagina anterior
    var previo = leer();
    if (previo && previo.msgs && previo.msgs.length) {
      historial = previo.msgs;
      repintar();
      // si el hilo termina sin sugerencias y solo estaba el saludo, se reponen
      if (historial.length === 1 && historial[0].k === 'sys' && historial[0].c === 'saludo') {
        chips(SUGERENCIAS[lang()]);
      }
      if (previo.abierto) abrir(true);
    }
  }

  function pintarTextos() {
    var l = lang();
    lanzador.setAttribute('aria-label', UI[l].abrir);
    panel.setAttribute('aria-label', UI[l].titulo);
    panel.querySelector('.as-tit').textContent = UI[l].titulo;
    panel.querySelector('.as-est').textContent = UI[l].estado;
    panel.querySelector('.as-cerrar').setAttribute('aria-label', UI[l].cerrar);
    panel.querySelector('.as-aviso').textContent = UI[l].aviso;
    campo.placeholder = UI[l].campo;
    panel.querySelector('.as-enviar').setAttribute('aria-label', UI[l].enviar);
  }

  var SALUDO = {
    es: 'Hola. Puedo contarte a qué se dedica Francisco, qué ha hecho en cada proyecto y cómo contactar con él. ¿Qué quieres saber?',
    pt: 'Olá. Posso contar-te a que se dedica o Francisco, o que fez em cada projeto e como contactá-lo. O que queres saber?',
    en: 'Hello. I can tell you what Francisco does, what he did on each project and how to reach him. What would you like to know?'
  };
  // cada sugerencia lleva su tema: nunca puede fallar al pulsarla
  var SUGERENCIAS = {
    es: [['¿Qué sabe hacer?', 'servicios'], ['¿Está disponible?', 'disponible'],
         ['Enséñame sus casos', 'portafolio'], ['¿Cómo le escribo?', 'contacto']],
    pt: [['O que sabe fazer?', 'servicios'], ['Está disponível?', 'disponible'],
         ['Mostra-me os casos', 'portafolio'], ['Como lhe escrevo?', 'contacto']],
    en: [['What can he do?', 'servicios'], ['Is he available?', 'disponible'],
         ['Show me his cases', 'portafolio'], ['How do I reach him?', 'contacto']]
  };
  var SEGUIR = {
    es: 'Quizá te sirva alguno de estos:',
    pt: 'Talvez te sirva algum destes:',
    en: 'Maybe one of these helps:'
  };
  var TITULOS = {
    servicios: { es: 'Qué sabe hacer', pt: 'O que sabe fazer', en: 'What he can do' },
    proceso: { es: 'Cómo trabaja', pt: 'Como trabalha', en: 'How he works' },
    resultados: { es: 'Resultados', pt: 'Resultados', en: 'Results' },
    porque: { es: 'Por qué contratarlo', pt: 'Porquê contratá-lo', en: 'Why hire him' },
    audiovisual: { es: 'Vídeo, foto y audio', pt: 'Vídeo, foto e áudio', en: 'Video, photo and audio' },
    sistema: { es: 'Sistema de diseño', pt: 'Sistema de design', en: 'Design system' },
    clientes: { es: 'Clientes y sectores', pt: 'Clientes e setores', en: 'Clients and sectors' },
    quien: { es: 'Quién es', pt: 'Quem é', en: 'Who he is' },
    contacto: { es: 'Cómo contactarle', pt: 'Como contactá-lo', en: 'How to reach him' },
    disponible: { es: 'Disponibilidad', pt: 'Disponibilidade', en: 'Availability' },
    donde: { es: 'Dónde está', pt: 'Onde está', en: 'Where he is' },
    experiencia: { es: 'Experiencia', pt: 'Experiência', en: 'Experience' },
    web: { es: 'Desarrollo web', pt: 'Desenvolvimento web', en: 'Web development' },
    diseno: { es: 'Diseño gráfico', pt: 'Design gráfico', en: 'Graphic design' },
    ia: { es: 'Trabajo con IA', pt: 'Trabalho com IA', en: 'Work with AI' },
    marketing: { es: 'Redes y marketing', pt: 'Redes e marketing', en: 'Social and marketing' },
    idiomas: { es: 'Idiomas', pt: 'Idiomas', en: 'Languages' },
    formacion: { es: 'Formación', pt: 'Formação', en: 'Education' },
    cv: { es: 'Su CV', pt: 'O seu CV', en: 'His CV' },
    elum: { es: 'Elum Tarot', pt: 'Elum Tarot', en: 'Elum Tarot' },
    kiara: { es: 'Kiara y Dorian', pt: 'Kiara e Dorian', en: 'Kiara and Dorian' },
    jardin: { es: 'El Jardín de las Diosas', pt: 'El Jardín de las Diosas', en: 'El Jardín de las Diosas' },
    proclade: { es: 'Proclade + CMF', pt: 'Proclade + CMF', en: 'Proclade + CMF' },
    portafolio: { es: 'Los cuatro casos', pt: 'Os quatro casos', en: 'The four cases' },
    precio: { es: 'Precios', pt: 'Preços', en: 'Pricing' },
    plazos: { es: 'Plazos', pt: 'Prazos', en: 'Timing' },
    linkedin: { es: 'LinkedIn', pt: 'LinkedIn', en: 'LinkedIn' }
  };
  function titulo(tema, l) {
    var t = TITULOS[tema.id];
    return t ? (t[l] || t.es) : tema.id;
  }
  var NO_SE = {
    es: 'Eso concreto no lo tengo en la web y prefiero no inventármelo — para eso está Francisco, que responde él en persona.',
    pt: 'Isso em concreto não o tenho no site e prefiro não o inventar — para isso está o Francisco, que responde em pessoa.',
    en: 'I do not have that specific thing on the site and I would rather not make it up — that is what Francisco is for, and he answers in person.'
  };


  /* ---------------------------------------------------------
     Tarjeta de correo
     Un mailto solo funciona si el sistema tiene una aplicacion
     de correo asociada. Aqui siempre hay una salida: la
     direccion a la vista, copiarla, o abrir el correo web.
     --------------------------------------------------------- */
  var ASUNTO = 'Proyecto - Francisco Sarria';

  function copiar(texto, boton, l) {
    function hecho() {
      var antes = boton.textContent;
      boton.textContent = UI[l].copiado;
      boton.classList.add('as-copiado');
      setTimeout(function () {
        boton.textContent = antes;
        boton.classList.remove('as-copiado');
      }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(hecho, function () { aPelo(); });
    } else {
      aPelo();
    }
    function aPelo() {
      var t = document.createElement('textarea');
      t.value = texto;
      t.setAttribute('readonly', '');
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); hecho(); } catch (e) { /* nada que hacer */ }
      document.body.removeChild(t);
    }
  }

  function tarjetaCorreo(restaurando) {
    if (!restaurando) { historial.push({ k: 'correo' }); guardar(); }
    var l = lang();
    var caja = el('div', 'as-b as-b--as as-correo');

    var p = el('p', null, UI[l].corDir);
    caja.appendChild(p);

    var fila = el('div', 'as-dir');
    var code = el('code', null, CORREO);
    var bcopiar = el('button', 'as-btn as-btn--p', UI[l].copiar);
    bcopiar.type = 'button';
    bcopiar.addEventListener('click', function () { copiar(CORREO, bcopiar, l); });
    fila.appendChild(code);
    fila.appendChild(bcopiar);
    caja.appendChild(fila);

    var acc = el('div', 'as-acc');
    [
      { t: UI[l].gmail, h: 'https://mail.google.com/mail/?view=cm&fs=1&to=' +
        encodeURIComponent(CORREO) + '&su=' + encodeURIComponent(ASUNTO) },
      { t: UI[l].outlook, h: 'https://outlook.live.com/mail/0/deeplink/compose?to=' +
        encodeURIComponent(CORREO) + '&subject=' + encodeURIComponent(ASUNTO) },
      { t: UI[l].appCorreo, h: 'mailto:' + CORREO + '?subject=' + encodeURIComponent(ASUNTO) }
    ].forEach(function (a, i) {
      var n = document.createElement('a');
      n.href = a.h;
      n.className = 'as-btn';
      n.textContent = a.t;
      if (i < 2) { n.target = '_blank'; n.rel = 'noopener noreferrer'; }
      acc.appendChild(n);
    });
    caja.appendChild(acc);

    caja.appendChild(el('p', 'as-corpie', UI[l].corPie));
    hilo.appendChild(caja);
    hilo.scrollTop = hilo.scrollHeight;
  }

  /* ---------------------------------------------------------
     Memoria de la conversacion
     Se guarda en la sesion del navegador: dura mientras la
     pestaña siga abierta, que es lo que dura una visita.
     Se guarda lo que se dijo, no como se dijo, para poder
     repintarlo en otro idioma.
     --------------------------------------------------------- */
  var LLAVE = 'fs-asistente';
  var historial = [];
  var TOPE = 40;

  function guardar() {
    try {
      sessionStorage.setItem(LLAVE, JSON.stringify({
        abierto: abierto,
        msgs: historial.slice(-TOPE)
      }));
    } catch (e) { /* modo privado o almacenamiento lleno: no pasa nada */ }
  }

  function leer() {
    try {
      var v = sessionStorage.getItem(LLAVE);
      return v ? JSON.parse(v) : null;
    } catch (e) { return null; }
  }

  var SISTEMA = { saludo: SALUDO, nose: NO_SE, seguir: SEGUIR };

  // pinta una entrada del historial en el idioma actual
  function pintar(e) {
    var l = lang();
    if (e.k === 'yo') return burbuja('yo', e.t);
    if (e.k === 'as') {
      var t = porId(e.id);
      if (t) return burbuja('as', t.r[l] || t.r.es, t.a);
      return burbuja('as', e.t || '');
    }
    if (e.k === 'sys') {
      return burbuja('as', (SISTEMA[e.c] || {})[l] || '',
                     e.c === 'nose' ? ['mail', 'wsp'] : null);
    }
    if (e.k === 'chips') {
      return chips(e.ids.map(function (id) {
        var t = porId(id);
        return t ? [titulo(t, l), id] : null;
      }).filter(Boolean));
    }
    if (e.k === 'correo') return tarjetaCorreo(true);
  }

  // registra y pinta
  function agregar(e) {
    historial.push(e);
    pintar(e);
    guardar();
  }

  // vuelve a pintar todo el hilo, por ejemplo al cambiar de idioma
  function repintar() {
    hilo.innerHTML = '';
    historial.forEach(pintar);
    hilo.scrollTop = hilo.scrollHeight;
  }

  function burbuja(quien, texto, accs) {
    var b = el('div', 'as-b as-b--' + quien);
    b.appendChild(el('p', null, texto));
    if (accs && accs.length) {
      var mapa = acciones(lang());
      var caja = el('div', 'as-acc');
      accs.forEach(function (k) {
        var a = mapa[k];
        if (!a) return;
        // el correo abre una tarjeta: un mailto suelto no funciona si no hay
        // aplicacion de correo configurada, y falla en silencio
        if (a.tarjeta) {
          var bt = document.createElement('button');
          bt.type = 'button';
          bt.className = 'as-btn as-btn--p';
          bt.textContent = a.t;
          bt.addEventListener('click', function () { tarjetaCorreo(); });
          caja.appendChild(bt);
          return;
        }
        var n = document.createElement('a');
        n.href = a.h;
        n.className = 'as-btn' + (a.p ? ' as-btn--p' : '');
        n.textContent = a.t;
        if (a.ext) { n.target = '_blank'; n.rel = 'noopener noreferrer'; }
        if (a.dl) n.setAttribute('download', '');
        caja.appendChild(n);
      });
      b.appendChild(caja);
    }
    hilo.appendChild(b);
    hilo.scrollTop = hilo.scrollHeight;
    return b;
  }

  // cada chip lleva su tema, asi que responder no depende de acertar el texto
  function chips(lista) {
    var caja = el('div', 'as-chips');
    lista.forEach(function (par) {
      var texto = par[0], id = par[1];
      var c = el('button', 'as-chip', texto);
      c.type = 'button';
      c.addEventListener('click', function () {
        caja.remove();
        preguntar(texto, porId(id));
      });
      caja.appendChild(c);
    });
    hilo.appendChild(caja);
    hilo.scrollTop = hilo.scrollHeight;
  }

  function preguntar(texto, forzado) {
    agregar({ k: 'yo', t: texto });
    var l = lang();
    var tema = forzado || buscar(texto, l);
    var espera = el('div', 'as-b as-b--as as-esperando');
    espera.innerHTML = '<span></span><span></span><span></span>';
    hilo.appendChild(espera);
    hilo.scrollTop = hilo.scrollHeight;

    setTimeout(function () {
      espera.remove();
      if (tema) {
        agregar({ k: 'as', id: tema.id });
        return;
      }
      // sin tema claro: se admite y se ofrecen los caminos mas cercanos
      agregar({ k: 'sys', c: 'nose' });
      var vecinos = cercanos(texto, l);
      if (vecinos.length) {
        agregar({ k: 'sys', c: 'seguir' });
        agregar({ k: 'chips', ids: vecinos.map(function (t) { return t.id; }) });
      }
    }, quieto ? 0 : 380);
  }

  function abrir(silencioso) {
    if (!silencioso) ultimoFoco = document.activeElement;
    panel.hidden = false;
    abierto = true;
    lanzador.classList.add('as-lanzador--on');
    if (!historial.length) {
      var l = lang();
      agregar({ k: 'sys', c: 'saludo' });
      chips(SUGERENCIAS[l]);
    }
    guardar();
    if (!silencioso) setTimeout(function () { campo.focus(); }, 60);
  }

  function cerrar() {
    panel.hidden = true;
    abierto = false;
    lanzador.classList.remove('as-lanzador--on');
    guardar();
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  function alternar() { abierto ? cerrar() : abrir(); }

  /* el asistente sigue el idioma del sitio */
  new MutationObserver(function () {
    if (!panel) return;
    pintarTextos();
    // el hilo se vuelve a pintar en el idioma nuevo
    if (historial.length) repintar();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', construir);
  } else {
    construir();
  }
})();
