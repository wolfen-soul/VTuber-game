const API_BASE_URL = '/api';
const CHAT_MESSAGE_INTERVAL = 2000;
const GREEN_SQUARE_CHECK_INTERVAL = 1;

let gameInterval;
let colorInterval;
let chatInterval;
let greenSquareCheckInterval;
let autoSaveInterval;
let isGameActive = false;
let lastGreenSquareTime = 0;
let currentSession = null;
let token = null;
let greenSquareInterval = 1000;

const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('time');
const viewersElement = document.getElementById('viewers');
const donationsElement = document.getElementById('donations');
const accuracyElement = document.getElementById('accuracy');
const streamTitleElement = document.getElementById('streamTitle');
const streamCategoryElement = document.getElementById('streamCategory');
const chatMessagesElement = document.getElementById('chatMessages');

const chatMessages = [
    "Привет, как дела?",
    "Классный стрим!",
    "Удачи в игре!",
    "Я новый подписчик!",
    "Как называется игра?",
    "Ты круто играешь!",
    "С днем рождения!",
    "Сколько уже играешь?",
    "Можно донат?",
    "Лучший стример!",
    "Желаю успехов!",
    "Какой красивый аватар!",
    "Спасибо за контент!",
    "Когда следующий стрим?",
    "Обожаю твои трансляции!",
    "Отличная реакция!",
    "Смешно!",
    "Интересно смотреть!",
    "Продолжай в том же духе!",
    "Какой твой ник в игре?",
    "Сколько FPS?",
    "Красиво проходишь!",
    "Мне нравится твой стиль",
    "Топовый контент!",
    "Подписываюсь!",
    "GG WP!",
    "Впечатляющая игра!",
    "Молодец!",
    "Кто тут?",
    "Всем привет!",
    "Что происходит?",
    "Хороший стрим!",
    "Спасибо за контент!",
    "Не останавливаемся!",
    "Это мой любимый момент!",
    "Кто хочет сыграть?",
    "Это весело!",
    "Спасибо за поддержку!",
    "До новых встреч!",
    "Не пропустите следующий стрим",
    "Берегите себя",
    "Пока-пока!",
    "GG EZ!",
    "Мощный клип!",
    "Кто с моего стрима?",
    "LUL",
    "Когда начался стрим?",
    "Повеселее бы...",
    "МодCheck?",
    "Покажи настройки!",
    "Жестко!",
    "Что в донатах?",
    "Жду дроп...",
    "Топ стрим!",
    "ХАХАХАХА",
    "Задонатил на пиво.",
    "Мне пора спать, спокойной ночи!",
    "Кринж...",
    "Жаль, что не застал начало.",
    "Снова на работе смотрю.",
    "Стример, включи музыку!",
    "Я бы так не смог.",
    "Моника, забани его.",
    "Clap",
    "Топовый контент.",
    "Поговори с чатом.",
    "Ты что, читеришь?",
    "Включи другую игру.",
    "Почему такой низкий FPS?",
    "Я в шоке.",
    "Поехали!",
    "Это баг или фича?",
    "Нервничаю за тебя.",
    "Всё пропало...",
    "Ты видел это?!",
    "F",
    "Pog",
    "Зачем ты это сделал?",
    "Пока не понял, что происходит.",
    "Стрим на заказ?",
    "Ты сегодня в ударе.",
    "Мне нравится эта музыка.",
    "Давай, ты сможешь!",
    "KEKW",
    "Я тоже так думаю.",
    "Снова одно и то же.",
    "Жарко тут.",
    "Ты в Discord зайдешь?",
    "Это провал.",
    "Мощно!",
    "Я подписался!",
    "Стример, ответь в чате.",
    "Время донатов!",
    "Жду скилл.",
    "Ты много спишь?",
    "Задонатью за идею.",
    "Почему такой тихий?",
    "Это легендарно!",
    "Я новенький здесь.",
    "Ты из какого города?",
    "Жаль, что не будет клипа.",
    "Всё по плану.",
    "Топ-1 этот стрим.",
    "Я плачу...",
    "Забани меня, если сможешь.",
    "Стример, не грусти.",
    "Что-то лагает.",
    "Моника, дай права.",
    "Это было нечестно.",
    "Жду когда проиграешь.",
    "Ты лучший!",
    "Почему нет камеры?",
    "Позови друга.",
    "Я тоже так играю.",
    "Время стрима пролетело незаметно.",
    "Хватит донатить ерунду.",
    "Это банально.",
    "Запусти !roll",
    "Жду реакцию.",
    "Пока не понял игру.",
    "Ты сегодня уставший.",
    "PepeLaugh",
    "Стример, смени игру.",
    "Это новый рекорд?",
    "Почему чат такой токсичный?",
    "Ты забыл про нас.",
    "Это был развод.",
    "Жду контент.",
    "Ты часто стримишь?",
    "HYPERCLAP",
    "Я ухожу, было скучно.",
    "Покажи донаты.",
    "Всё из-за лагов.",
    "Ты много ешь на стриме.",
    "Okayge",
    "Почему нет модов?",
    "Это лучший момент.",
    "Я предсказал это.",
    "Ты не прав.",
    "Стример, хватит читать чат.",
    "Время викторины!",
    "Ты сегодня молодец.",
    "Pepega",
    "Я тоже хочу стримить.",
    "Почему такой грустный?",
    "Стример, не обращай внимания.",
    "Время рекламы...",
    "Это был кликбейт.",
    "Ты используешь макросы?",
    "Почему такой громкий?",
    "Покажи статистику.",
    "Всё пучком.",
    "Ты часто отвечаешь в чате?",
    "Почему нет виджетов?",
    "Это просто невероятно.",
    "Я знал, что так будет.",
    "Ты улучшаешься.",
    "Стример, сделай перерыв.",
    "Время банов.",
    "Ты сегодня в ярости.",
    "Я подписался на 10 месяцев!",
    "Всё по канону.",
    "Ты часто проигрываешь?",
    "Clap",
    "Задонатьте на кофе.",
    "Почему нет рекорда?",
    "Это заслуживает хайпа.",
    "Я в этом чате как дома.",
    "Ты сделал мой день.",
    "Время для анекдота.",
    "Ты сегодня добрый.",
    "Жду когда выиграешь.",
    "Я тоже задонатил.",
    "Это лучший стрим за неделю.",
    "Почему такой медленный?",
    "Всё ради контента.",
    "Ты часто банишь?",
    "Задонатьте на пиццу.",
    "Почему нет задержки чата?",
    "Я не ожидал такого.",
    "Время для истории.",
    "Жду когда заметишь мое сообщение.",
    "Я уже 100 раз это писал.",
    "Это худшее решение.",
    "Почему такой высокий пинг?",
    "Покажи свой ПК.",
    "Ты часто забываешь про чат?",
    "Почему нет кастомных команд?",
    "Я помню твой первый стрим.",
    "Стример, проверь звук.",
    "Ты сегодня в ударе!",
    "Я не могу оторваться.",
    "Это лучший момент дня.",
    "Ты слишком стараешься.",
    "Почему так темно?",
    "Покажи настройки мыши.",
    "Всё ради хайпа.",
    "Ты часто слушаешь чат?",
    "Задонатьте на новый микрофон.",
    "Почему нет активностей?",
    "Это не fair play.",
    "Я удивлен.",
    "Ты заслуживаешь большего.",
    "Стример, не сдавайся.",
    "Время для минутки памяти.",
    "Ты сегодня особенно хорош.",
    "Жду когда будешь читать донаты.",
    "Я тоже хочу так играть.",
    "Это был разрыв шаблона.",
    "Ты используешь геймпад?",
    "Покажи своего питомца.",
    "Всё идет по плану.",
    "Ты часто меняешь игры?",
    "Задонатьте просто так.",
    "Почему нет интервью?",
    "Это твой фирменный стиль.",
    "Я верю в тебя!",
    "Ты делаешь это лучше всех.",
    "Стример, ответь на мой вопрос.",
    "Время для розыгрыша?",
    "Ты сегодня много шутишь.",
    "Я смотрю с телефона.",
    "Это было предсказуемо.",
    "Ты слишком самоуверен.",
    "Почему такой низкий битрейт?",
    "Покажи свою комнату.",
    "Всё к лучшему.",
    "Ты часто сотрудничаешь с другими?",
    "Задонатьте на новую игру.",
    "Я не согласен с тобой.",
    "Ты должен отдохнуть.",
    "Стример, включи ночной режим.",
    "Я рассказал о тебе друзьям.",
    "Это неловко...",
    "Покажи свою коллекцию.",
    "Всё ради искусства.",
    "Почему нет гифок в чате?",
    "Я ждал этого момента.",
    "Ты переигрываешь.",
    "Стример, смени разрешение.",
    "Время для благотворительности.",
    "Ты сегодня очень продуктивный.",
    "Жду когда скажешь 'Чату спасибо'.",
    "Я купил саб на 6 месяцев!",
    "Ты используешь VPN?",
    "Почему такой счастливый?",
    "Покажи свой монитор.",
    "Ты часто опаздываешь на стрим?",
    "Почему нет кастомных смайликов?",
    "Я в восторге!",
    "Ты стал частью моей рутины.",
    "Стример, сделай громче.",
    "Время для конкурса!",
    "Ты сегодня очень сосредоточен.",
    "Жду когда прорекламируешь соцсети",
    "Я смотрю тебя вместо сериала.",
    "Ты слишком критикуешь себя.",
    "Почему такой цвет волос?",
    "Покажи свой стул.",
    "Задонатьте на новую клавиатуру.",
    "Почему нет TTS?",
    "Это изменило мое мнение.",
    "Я не могу поверить своим глазам.",
    "Ты должен быть осторожнее.",
    "Стример, проверь настройки стрима.",
    "Ты сегодня очень вдохновляешь.",
    "Ты играешь не в ту игру.",
    "Покажи свой распорядок дня.",
    "Ты часто пьешь воду на стриме?",
    "Почему нет хайлайтов?",
    "Это твоя фишка.",
    "Я учусь у тебя.",
    "Ты выглядишь уставшим, отдохни.",
    "Время для благодарностей саберам!",
    "Ты сегодня очень терпелив.",
    "Я с тобой с самого первого дня.",
    "Покажи свой сетап.",
    "Это твоя лучшая игра.",
    "Я горжусь тобой.",
    "Ты заставляешь меня смеяться.",
    "Ты сегодня очень мотивируешь.",
    "Жду когда выйдешь в оффлайн.",
    "Я поставил тебя на фон.",
    "Это было эпично!",
    "Покажи свои достижения.",
    "Всё к лучшему в этом лучшем из миров.",
    "Ты часто банишь хейтеров?",
    "Почему нет трекера донатов?",
    "Это был камбэк года.",
    "Я записал это на клип.",
    "Ты неправильно понял игру.",
    "Время для сюрприза!",
    "Ты сегодня очень внимателен к чату.",
    "Жду когда проиграешь из-за чата.",
    "Я сделал тебе фан-арт.",
    "Это был развод полнейший.",
    "Ты играешь слишком агрессивно.",
    "Почему такой дорогой донат?",
    "Всё ради сообщества.",
    "Ты часто перечитываешь сообщения?",
    "Задонатьте на новый процессор.",
    "Почему нет дискорд-сервера?",
    "Это твой уникальный стиль.",
    "Я рекомендую тебя всем.",
    "Ты стал увереннее.",
    "Стример, сделай звук тише.",
    "Время для импровизации!",
    "Ты сегодня очень креативен.",
    "Я смотрю тебя в 4K.",
    "Ты используешь не те таланты.",
    "Почему такой популярный стрим?",
    "сегодня стрим до утра, договорились?",
    "чат, давайте устроим флешмоб #aga",
    "сегодня можно и донатить без повода, верно?",
    "а споёшь нам песенку?",
    "респект топ донатерам",
    "ОБЯЗАТЕЛЬНО СПОЙ 'Tokyo Ghoul Op'!",
    "кто нибудь записывает её реакцию? это же история!",
    "Спасибо, что появилась на свет и радуешь нас!",
    "какой же милый арт от фанатов в твиттере!",
    "Сколько тебе лет?",
    "Где ты живешь?",
    "Lol",
    "xdd",
    "сегодня можно и опоздать на стрим, прощаем",
    "Ты забыла поставить категорию!!!",
    "Легенда",
    "она сегодня такая счастливая, сердце тает",
    "ради этого и живём",
    "мы тебя любим именно такой!",
    "заключаем пари?",
    "смотрим, угадал ли кто-то",
    "скриншотим всем чатом!",
    "отличный повод пересмотреть все старые стримы",
    "Ты вдохновляешь нас каждый день! Спасибо тебе!",
    "сегодня рекорд по донатам?",
    "она устала от внимания, но это милая усталость",
    "завтра новая эра!",
    "Пусть все беды обходят стороной!",
    "Ждем именинную песню от тебя!",
    "Ты заслужила весь мир!",
    "Лучший чат!",
    "жду обязательное 'спасибо' на 10 языках",
    "а помнишь свой первый донат? вот это был кринж",
    "Купи себе новый микрофон, этот уже хрипит!",
    "Спасибо, что родилась и делаешь наши дни ярче!",
    "какой же крутой монтаж от фанатов в дискорде!",
    "Когда на тв?",
    "А ТАКОЕ ВОЗМОЖНО?",
    "она сегодня так сияет, глаза горят",
    "а что пьёшь? сок? чай? колу?",
    "это момент вошёл в историю!",
    "записываем всем чатом!",
    "Ты делаешь нас лучше! Спасибо!",
    "очень близко!",
    "чат, видели новый кавер?",
    "скиньте ссылку, я пропустил",
    "кто делает лучшие каверы на витуберские темы?",
    "талант",
    "госпожа",
    "...",
    "только бы токсики не пришли",
    "хочу в Японию",
    "классика",
    "Респект всем программистам в нашем чате!",
    "мы захватываем мир!",
    "это да, талант и скорость",
    "Спасибо всем, кто создает. Вы — фундамент этого комьюнити!",
    "а она его видела? какая реакция?",
    "во что сегодня играем?",
    "не слушайте их, они тролли",
    "о нет, она опять заблудилась",
    "моя бабушка быстрее играет",
    "она не выживет",
    "благослови тебя бог",
    "кавайииии",
    "о чем это она?",
    "чат, успокойтесь",
    "забанить его",
    "она проигнорировала вопрос...",
    "я новичок, объясните",
    "не объясняем, погружайся с головой",
    "добро пожаловать в наш чат",
    "Zzzzzzz",
    "Разбудите меня, когда начнется что-то интересное",
    "чел, ты чё несёшь?",
    "ананас в пицце — это норма?",
    "чай или кофе?",
    "какое аниме посмотреть?",
    "донат Какое аниме посоветуете для поднятия настроения?",
    "как ваш день?",
    "у меня снег",
    "чат, что делаете?",
    "ага",
    "Ребята, не забывайте жить оффлайн жизнью тоже!",
    "чат, я слышал странный звук, это у меня одного?",
    "что это было?",
    "спасибо, теперь не усну",
    "я в доту с пяти лет",
    "c 2011 на meepo",
    "но без кринжа же не интересно",
    "олды здесь?",
    "А у стримерши какая любимая игра?",
    "спамят пеко",
    "ой, простите",
    "ура! ура! ура!",
    "новый мем",
    "она в панике",
    "Heart Heart Heart",
    "okayeg",
    "УРА! ТЫ СПРАВИЛАСЬ!",
    "молодец!",
    "Ты лучшая!",
    "спокойной ночи, чат, я спать",
    "мы тебя любим!",
    "опоздал буквально на 5 минут, что пропустил?",
    "мило!",
    "удачи!",
    "покажи результат!",
    "ЧАТ УМЕР!",
    "мои соседи проснулись",
    "ее лицо... priceless",
    "clueless",
    "скриншот для истории",
    "venom",
    "чат, болеем за нее!",
    "давай! давай! давай!",
    "красава!",
    "чат, пошли обсуждать в дискорд",
    "пока-пока!",
    "чат, скучали?",
    "люблю такие стримы",
    "Как прошел твой день?",
    "Будет ли asmr стрим?",
    "Я сегодня видел кота, похожего на твоего"
];

const userNames = [
    "Рогоз", "CenturionDynamite", "belo", "megabelka", "des1re", "sousLUCK", "Goddish", "orenmoe", "xevakoz", "Sh1zu",
    "Cloudset", "Sdreum", "DanielWolf", "PhoNiks", "ZeFres", "ShadowBlade", "NeonGhost", "CyberWolf", "Eclipse", "Vortex",
    "Phantom", "Nova", "Titan", "Zenith", "Orion", "Raptor", "Onyx", "Crimson", "Nexus", "Valkyrie", "Sphinx", "Odyssey",
    "Mirage", "Quantum", "Infinity", "Eclipse", "Arsenal", "Tempest", "Vagabond", "Warlock", "Ronin", "Juggernaut", "Apex",
    "Vanguard", "Spectre", "Oblivion", "Harbinger", "Paladin", "Catalyst", "Dynamo", "Echo", "Rogue", "Sentinel", "Prowler",
    "Meridian", "SirDiesALot", "LaggingPotato", "NoobMasterFlex", "CaptainClutch", "Missclicks", "TheCarryIsAFake", "DadBot",
    "GrammarNazi", "SaltySnacks", "WiFu4Life", "Teabaggins", "LordOfThePings", "AimBotAndy", "UncleTouchy", "laggyMcLagface",
    "CritMiss", "DroppedConnection", "BadRNGesus", "AFKinTheBush", "Pwnography", "TheKnightWhoSaysNi", "CrouchingTigerNoobDragon",
    "MrFriendlyFire", "DrDisrespectful", "PrincessSarcasm", "ItsJustAPrankBro", "KevinFromAccounting", "DontPushRedButton",
    "HoldMyBeer", "ProbablyAFK", "INeedHealing", "TeamKillConfirmed", "LagSpike", "NerfThis", "SoIcy", "MomGetTheCamera",
    "TacticalYawn", "ProfessionalPotato", "NotASuspect", "Error404SkillNotFound", "Dragonheart", "MoonlightSage", "Starfall",
    "AncientOne", "SpiritWalker", "Runemaster", "Grimwald", "ElvenArcher", "ShadowWeaver", "CrystalDrake", "Netherborne",
    "AstralProjection", "MythicDreamer", "Oracle", "PhoenixFire", "GoblinKing", "DwarvenForge", "Necromancer", "Archmage",
    "Celestial", "VoidWalker", "TwilightSeer", "EnchantedForest", "SorcererSupreme", "Beastmaster", "GhostlyGalleon", "Lorekeeper",
    "FatesCall", "MysticRiver", "SilverGryphon", "IronDragon", "WitchHunter", "Planeswalker", "SoulReaper", "EternalGuardian",
    "FrostGiant", "SunPriest", "Darkwood", "BloodMage", "StormBringer", "RedPanda", "ArcticFox", "LoneWolf", "Kingfisher",
    "ThunderBear", "SilentOwl", "RustyBadger", "EmeraldPython", "DireWolf", "HoneyBadger", "IvoryFalcon", "CoralSnake", "MossyOak",
    "RiverStone", "Wildfire", "AutumnLeaf", "MountainPeak", "OceanDepth", "SolarFlare", "Tundra", "VolcanicAsh", "WhisperingPine",
    "BlazingSun", "CrashingWave", "DesertWind", "FrozenLake", "GoldenEagle", "HowlingJackal", "JungleCat", "LightningBolt",
    "NightHawk", "OakHeart", "PrairieDog", "QuicksilverFox", "Ravenous", "SnowLeopard", "ThornyRose", "UmbraBat", "ViperNest",
    "WillowWisp", "SaltyPretzel", "CrispyBacon", "SassySoda", "MightyMango", "GlazedDonut", "SpicyRamen", "CaramelCloud", "BerryBlast",
    "ToastyBagel", "JuicyBurger", "PickleRick", "CaptainCrunch", "DoctorPepper", "SirPancake", "MadameWaffle", "LordOfTheFries",
    "BaronVonCupcake", "SushiRoll", "TacoTuesday", "NachoAverageGamer", "PizzaLord", "ColonelCookie", "ProfessorPasta",
    "TheGingerBreadMan", "WatermelonSugar", "IcedCoffee", "HotChocolate", "CarrotCake", "DumplingMaster", "EspressoShot", "FruitPunch",
    "GrilledCheese", "HoneyDew", "IceCreamSandwich", "JellyBean", "KiwiCutie", "LemonDrop", "MacNCheese", "NoodleSoup", "DataStream",
    "GlitchInTheMatrix", "ZeroCool", "CrashOverride", "ByteMe", "Mainframe", "PixelPusher", "RoboCat", "Synapse", "TerminalVelocity",
    "Vector", "WireFrame", "BioHazard", "CircuitBreaker", "DeepBlue", "Electron", "Firewall", "HyperLink", "Interface", "JavaScript",
    "KernelPanic", "LogicBomb", "NanoBot", "Overclocked", "QuantumLoop", "RootAccess", "SiliconValley", "TrojanHorse", "UserNotFound",
    "VirtualMemory", "Wi-FiKid", "XeroOne", "Yottabyte", "ZombieProcess", "AlphaGeek", "BetaTester", "CyberNinja", "DigitalGhost",
    "ErrorCode", "FutureProof", "Vex", "Dovahkiin", "ShepardCommander", "Witcher", "MasterChief", "Starkiller", "SolidSnake", "LaraCroft",
    "Kirito", "Leviathan", "NormandySR2", "PandoraBox", "Rapture", "Skywalker", "Tardis", "VaultHunter", "WhiteWalker", "Xenomorph",
    "Yoshi", "Zelda", "Akatsuki", "Belmont", "CloudStrife", "DoomSlayer", "EzioAuditore", "FinalFantasy", "Ganon", "Hawkeye", "IronMan",
    "JohnWick", "Katniss", "Link", "Mario", "NathanDrake", "ObiWan", "PacMan", "RyuHayabusa", "Sephiroth", "Triss", "UmbrellaCorp",
    "EchoLima", "SierraTango", "WhiskeyTangoFoxtrot", "AlphaBravo", "CharlieDelta", "EchoSierra", "FoxtrotUniform", "GolfHotel",
    "IndiaJuliett", "KiloMike", "LimaNovember", "MikeOscar", "NovemberOscar", "OscarMike", "PapaQuebec", "QuebecRomeo", "RomeoAlpha",
    "SierraVictor", "TangoYankee", "UniformZulu", "VictorYankee", "YankeeZulu", "ZuluAlpha", "NumberOne", "TheFinalChapter",
    "PointOfNoReturn", "StateOfMind", "TheGreatPerhaps", "MidnightOil", "GlassHalfFull", "TheOtherSide", "TheSilentType", "TheQuietStorm",
    "TheDarkHorse", "TheLastStand", "TheFirstLight", "TheLongGame", "TheShortStraw", "TheBigPicture", "TheFinePrint",
    "NebulaKnight", "QuantumQuasar", "StellarDrift", "VoidSinger", "ChronoWraith", "SolarSentry", "LunarPhantom", "CosmicRider",
    "GalaxyHunter", "AstralWanderer", "NovaStriker", "CometChaser", "MeteorMage", "OrbitGuardian", "PulsarPilot", "QuasarKing",
    "SupernovaSage", "BlackholeBandit", "GravityGhost", "DarkMatterMan", "SpaceTimeSam", "InterstellarIan", "CosmosCarl", "UniverseUlysses",
    "MilkyWayMax", "AndromedaAndy", "NebularNick", "StellarSteve", "CelestialChris", "PlanetaryPete", "MartianMike", "VenusVince",
    "JupiterJack", "SaturnSam", "UranusUther", "NeptuneNate", "PlutoPaul", "MercuryMark", "EarthEthan", "SunnyScott", "MoonlightMitch",
    "StarDustDan", "AsteroidAlex", "MeteoriteMatt", "CosmicRayRoy", "SolarWindWill", "LunarLightLuke", "SpaceCadetKarl", "RocketRick",
    "ShuttleShep", "ProbeParker", "SatelliteSeth", "OrbiterOscar", "LaunchPadLiam", "MissionControlMoe", "AstronautAbe", "SpaceWalkerWalt",
    "ZeroGZack", "VacuumVic", "PressureSuitPat", "SpaceHelmetHank", "GForceGus", "EscapeVelocityEvan", "TrajectoryTroy", "PayloadPete",
    "DockingPortDave", "SpaceStationStan", "LunarLanderLarry", "MarsRoverRob", "TelescopeTom", "ObservatoryOlly", "PlanetariumPam",
    "ConstellationCon", "ZodiacZoe", "SiriusSam", "PolarisPete", "BetelgeuseBen", "RigelRandy", "VegaVince", "CanopusCarl",
    "ArcturusArt", "CapellaCap", "AltairAl", "AldebaranDan", "AntaresTony", "SpicaSid", "RegulusReg", "FomalhautFay",
    "DenebDeb", "MiraMax", "AlgolAl", "CastorCas", "PolluxPol", "BellatrixBelle", "MintakaMint", "AlnilamAl",
    "AlnitakZak", "SaiphSai", "MeissaMey", "PhantomPhoton", "QuantumQuark", "ProtonPete", "NeutronNed", "ElectronEllie",
    "MuonMoe", "TauTom", "GluonGus", "BosonBill", "FermionFrank", "LeptonLeo", "HadronHal", "MesonMeg",
    "BaryonBarry", "QuarkQuincy", "CharmCharlie", "StrangeSteve", "TopTim", "BottomBob", "UpUlysses", "DownDan",
    "PhotonPhil", "GravitonGraham", "HiggsHank", "WbosonWes", "ZbosonZed", "PionPia", "KaonKay", "EtaEthan",
    "LambdaLiam", "SigmaSam", "XiXander", "OmegaOmar", "DeltaDiane", "GammaGail", "BetaBen", "AlphaAlice",
    "NucleusNick", "AtomAndy", "MoleculeMolly", "CompoundChris", "ElementEli", "IsotopeIvy", "IonIan", "CationCat",
    "AnionAnn", "PlasmaPam", "GasGus", "LiquidLiz", "SolidSol", "BoseEinsteinBose", "FermiDiracFermi", "MaxwellBoltzmannMax",
    "QuantumFieldQ", "StringTheorySteve", "LoopQuantumLarry", "MTheoryMike", "BraneBrain", "DimensionDave", "MultiverseMoe",
    "ParallelPat", "AlternateAl", "TimelineTim", "RealityRick", "UniverseUrsula", "CosmosCora", "ExistenceXander", "BeingBen",
    "ConsciousnessCon", "MindMax", "ThoughtTheo", "IdeaIda", "ConceptCon", "AbstractArt", "TheoreticalTheo", "HypotheticalHal",
    "ExperimentalEve", "ObservationalOlga", "EmpiricalEm", "ScientificSam", "ResearchRon", "DiscoveryDawn", "InventionIvan",
    "InnovationIna", "TechnologyTom", "EngineeringEd", "DesignDawn", "DevelopmentDev", "ProductionPete", "ManufacturingManny",
    "AssemblyAl", "QualityQuinn", "TestingTina", "DebuggingDeb", "ProgrammingPat", "CodingCara", "ScriptingScott", "AlgorithmAl",
    "FunctionFred", "VariableVal", "ConstantCon", "ParameterPam", "ArgumentArt", "ReturnRyan", "VoidVera", "ClassClara",
    "ObjectObi", "InstanceIan", "MethodMeth", "PropertyPat", "AttributeAtt", "InheritanceInez", "PolymorphismPoly", "EncapsulationEve",
    "AbstractionAbby", "InterfaceIvy", "ImplementationImp", "FrameworkFrank", "LibraryLib", "ModuleMod", "PackagePat",
    "DependencyDan", "RepositoryRepo", "VersionVic", "ControlCon", "SystemSam", "PlatformPat", "HardwareHal", "SoftwareSof",
    "FirmwareFirm", "MiddlewareMid", "CloudClara", "ServerSam", "ClientClem", "NetworkNed", "InternetIan", "WebWes",
    "BrowserBen", "SearchSear", "EngineEthan", "IndexInd", "QueryQuin", "ResultRon", "DataDawn", "DatabaseDan",
    "TableTina", "RowRory", "ColumnCol", "FieldFred", "RecordReg", "KeyKen", "ValueVal", "TypeTy",
    "SchemaSam", "ModelMod", "ViewVic", "ControllerCon", "RouteRuth", "EndpointEd", "RequestRon", "ResponseRex",
    "HeaderHal", "BodyBob", "StatusStan", "ErrorEvan", "ExceptionEx", "BugBret", "IssueIsa", "ProblemPat",
    "SolutionSol", "FixFelix", "PatchPat", "UpdateUlysses", "UpgradeUrsula", "MigrationMig", "DeploymentDev", "ReleaseRay",
    "BuildBill", "CompileCon", "InterpretIan", "ExecuteEve", "RuntimeRon", "MemoryMandy", "StorageStan", "CacheCara",
    "BufferBen", "StackSam", "HeapHal", "QueueQuinn", "ListLiz", "ArrayArt", "SetSeth", "MapManny",
    "TreeTina", "GraphGus", "NodeNed", "EdgeEd", "VertexVic", "LinkLiam", "PathPat", "RouteRory",
    "SortSam", "SearchSear", "FilterFil", "ReduceRed", "CallbackCal", "PromisePam", "AsyncAsh", "AwaitArt",
    "GeneratorGen", "IteratorIan", "LoopLarry", "WhileWes", "ForFrank", "DoDan", "IfIvy", "ElseEli",
    "SwitchSue", "CaseCal", "DefaultDev", "BreakBen", "ContinueCon", "ThrowTheo", "CatchCat", "FinallyFin",
    "TryTroy", "WithWes", "NewNed", "ThisTheo", "SuperSue", "ExtendsEx", "ImplementsImp", "StaticStan",
    "PublicPat", "PrivatePam", "ProtectedPro", "ReadonlyRed", "AbstractAbby", "SealedSal", "VirtualVic", "OverrideOvi",
    "EnumEve", "ConstCon", "LetLiz", "VarVal", "UndefinedUly", "NullNed", "NaNNan", "InfinityIan",
    "BooleanBen", "NumberNed", "StringStan", "SymbolSam", "DateDan", "RegexReg", "MathManny", "JSONJay",
    "SetSeth", "WeakMapWes", "WeakSetWendy", "ProxyPat", "ReflectRef", "IntlIan", "ConsoleCon", "DocumentDoc",
    "WindowWes", "NavigatorNat", "HistoryHal", "LocationLiz", "ScreenSam", "ElementEl", "AttributeAtt", "ClassListClara",
    "StyleStan", "CSSCon", "HTMLHal", "XMLXander", "SVGSav", "CanvasCan", "WebGLGlen", "AudioAl",
    "VideoVic", "MediaMeg", "StreamStan", "BlobBen", "FileFil", "FormFrank", "InputIan", "ButtonBen",
    "SelectSam", "OptionObi", "TextareaTia", "LabelLiz", "FieldsetFred", "LegendLen", "DivDan", "SpanSam",
    "ParagraphPat", "HeadingHal", "AnchorAnn", "ImageIan", "ListLiz", "TableTina", "FormFrank", "IframeIvy",
    "ScriptSam", "LinkLiam", "MetaMeg", "StyleStan", "TitleTom", "BodyBob", "HeadHal", "HtmlHal",
    "DoctypeDoc", "CommentCon", "EntityEve", "CharacterChar", "EncodingEd", "DecodingDev", "ParsingPat", "SerializingSal",
    "StringifyingStan", "TokenizingTom", "LexingLex", "CompilingCon", "InterpretingIan", "ExecutingEve", "OptimizingOli", "JITJim",
    "AOTArt", "TranspilingTran", "BundlingBen", "MinifyingMin", "UglifyingUly", "ObfuscatingObi", "CompressingCon", "DecompressingDev",
    "ArchivingArt", "ExtractingEx", "ZippingZoe", "TarringTom", "GzippingGus", "BrotliBro", "DeflateDev", "InflateIan",
    "LZ77Liz", "HuffmanHuff", "ArithmeticArt", "RangeRan", "CryptographyCrypto", "EncryptionEve", "DecryptionDev", "CipherChip",
    "KeyKen", "IVIvy", "SaltSal", "HashHal", "MD5Maddy", "SHA1Shay", "SHA256Sam", "SHA512Sid",
    "RSARon", "AESAl", "DSSDan", "ECCEC", "PKIPat", "CertificateCer", "AuthorityArt", "SigningSam",
    "VerificationVic", "AuthenticationAuth", "AuthorizationArt", "OAuthOli", "OpenIDOpie", "SAMLSam", "JWTJay", "TokenTom",
    "BearerBen", "BasicBas", "DigestDig", "APIAl", "RESTRon", "GraphQLGwen", "SOAPSam", "RPCRon",
    "WebSocketWes", "HTTPHal", "HTTPSHank", "GETGus", "POSTPat", "PUTPam", "DELETEDan", "PATCHPat",
    "HEADHal", "OPTIONSObi", "TRACETroy", "CONNECTCon", "StatusStan", "200Tom", "201Art", "204Fred",
    "301Moe", "302Mel", "304Nat", "400Ben", "401Una", "403For", "404Ned", "405Mel",
    "409Con", "500Sam", "502Bad", "503Sue", "504Gat", "CachingCara", "ETagEthan", "LastModifiedLiz",
    "ExpiresEx", "MaxAgeMax", "NoCacheNed", "NoStoreNor", "MustRevalidateMoe", "ProxyRevalidatePat", "PublicPat", "PrivatePam",
    "ImmutableIvy", "StaleWhileRevalidateStan", "BinaryBard", "CodeCrusader", "DataDruid", "ErrorEater", "FunctionFury", "GitGladiator",
    "HashHacker", "IterationKing", "JavaJester", "KernelKnight", "LoopLegend", "MatrixMage", "NullNinja", "ObjectOracle",
    "PointerPirate", "QueryQueen", "RecursionRanger", "StackSamurai", "TypeTitan", "UnixUnicorn", "VectorViking", "WebWizard",
    "XmlXenomorph", "YieldYogi", "ZipZephyr", "AlgorithmAlchemist", "BufferBuccaneer", "CacheConjurer", "DomainDragon", "EncryptionElf",
    "FirewallPhoenix", "GatewayGriffin", "HostHunter", "InternetImp", "JavascriptJaguar", "KeyKraken", "LambdaLeviathan", "MetadataManticore",
    "NetworkNymph", "OctalOgre", "ProtocolPegasus", "QueueQuetzal", "RootRoc", "SocketSiren", "TokenTroll", "UuidUnicorn",
    "VirtualValkyrie", "WrapperWraith", "XhrYeti", "ZeroDayZombie", "ApiArachne", "BackendBasilisk", "CookieCentaur", "DashboardDjinn",
    "EndpointEttin", "FrontendFairy", "GraphqlGorgon", "HeaderHarpy", "IconIfrit", "JsonJackal", "KubernetesKappa", "LoaderLich",
    "MiddlewareMermaid", "NodeNixie", "OfflineOuroboros", "PluginPuck", "QueryKraken", "ReactRedcap", "ServerSprite", "TypescriptTitan",
    "UiUmbral", "ValidationVampire", "WebpackWisp", "XmlHttpXorn", "YarnYeti", "ZoneZalgo", "AnchorAboleth", "ButtonBeholder",
    "CanvasCockatrice", "DivDoppelganger", "ElementElder", "FormFey", "GridGolem", "HtmlHydra", "InputIncubus", "JsJabberwock",
    "KeyframeKelpie", "LinkLamia", "MediaMimic", "NavNuckelavee", "OptionOoze", "PicturePixie", "QuoteQilin", "RubyRakshasa",
    "SectionScylla", "TableTarrasque", "UlUmberHulk", "VideoVodyanoy", "WebAssemblyWendigo", "XpathXvart", "YamlYowie", "ZIndexZombie",
    "AjaxAatxe", "BreakpointBoggart", "ContainerChupacabra", "DropdownDullahan", "EmberEfreet", "FlexFomor", "GridGargoyle", "HoverHobgoblin",
    "InlineIrrlicht", "JqueryJotun", "KebabKobold", "LessLadon", "MixinMandragora", "NormalizeNue", "OverflowOphiotaurus", "PaddingPeryton",
    "QuasarQuillot", "RemRusalka", "SassSphinx", "TransitionTroll", "UnitUnseen", "VariableVetala", "WebkitWillOWisp", "XanthXipe",
    "YuiYuki-onna", "ZurbZiz", "AdapterAdaro", "BridgeBaku", "CompositeCuca", "DecoratorDobhar-chu", "FacadeFenrir", "FlyweightFossegrim",
    "ObserverOgre", "ProxyPuck", "SingletonSiren", "StateStrigoi", "StrategySimurgh", "VisitorVila", "CommandCactuar", "InterpreterInugami",
    "IteratorImp", "MediatorMyling", "MementoMara", "PrototypePuck", "ChainChaneque", "FactoryFarbauti", "BuilderBies", "AbstractFactoryAitvaras",
    "FilterFylgia", "InterceptingFilterFirbolg", "FrontControllerFomor", "ModelViewControllerMyling", "BusinessDelegateBoggart", "DataAccessObjectDullahan",
    "ServiceLocatorSluagh", "TransferObjectTiyanak", "CompositeEntityCockatrice", "ProxyPatternPuca", "BuilderPatternBanshee", "FactoryMethodFenodyree",
    "AbstractFactoryAswang", "SingletonSkeleton", "AdapterAatxe", "BridgeBarghest", "FilterFachan", "InterceptingFilterImp", "FrontControllerFext",
    "ModelViewControllerManticore", "BusinessDelegateBogey", "DataAccessObjectDoppelganger", "ServiceLocatorSelkie", "TransferObjectTengu",
    "CompositeEntityCryptid", "ProxyPatternPishacha", "BuilderPatternBogie", "FactoryMethodFomor", "AbstractFactoryAlp", "SingletonSpecter",
    "AdapterAcheri", "BridgeBoginki", "FilterFirbolg", "InterceptingFilterIfrit", "FrontControllerFury", "ModelViewControllerMara",
    "BusinessDelegateBarghest", "DataAccessObjectDrekavac", "ServiceLocatorSiren", "TransferObjectTikbalang", "CompositeEntityChaneque",
    "ProxyPatternPuck", "BuilderPatternBoggart", "FactoryMethodFae", "AbstractFactoryAitvaras", "SingletonShade", "AdapterAlp",
    "BridgeBanshee", "FilterFomor", "InterceptingFilterGoblin", "FrontControllerGhoul", "ModelViewControllerGremlin", "BusinessDelegateBogey",
    "DataAccessObjectDybbuk", "ServiceLocatorShuck", "TransferObjectTroll", "CompositeEntityCockatrice", "ProxyPatternPixie", "BuilderPatternBogie",
    "FactoryMethodFamiliar", "AbstractFactoryApparition", "SingletonShadow", "AdapterAos-si", "BridgeBrownie", "FilterFachan", "InterceptingFilterHobgoblin",
    "FrontControllerHaint", "ModelViewControllerHob", "BusinessDelegateBoggart", "DataAccessObjectDullahan", "ServiceLocatorSpriggan", "TransferObjectTrow",
    "CompositeEntityCryptid", "ProxyPatternPuca", "BuilderPatternBarghest", "FactoryMethodFey", "AbstractFactoryAfanc", "SingletonSpecter",
    "AdapterAitvaras", "BridgeBoginki", "FilterFirbolg", "InterceptingFilterImp", "FrontControllerFury", "ModelViewControllerMara",
    "BusinessDelegateBogey", "DataAccessObjectDrekavac", "ServiceLocatorSiren", "TransferObjectTikbalang", "CompositeEntityChaneque",
    "ProxyPatternPuck", "BuilderPatternBoggart", "FactoryMethodFae", "AbstractFactoryAitvaras", "SingletonShade", "AdapterAlp",
    "BridgeBanshee", "FilterFomor", "InterceptingFilterGoblin", "FrontControllerGhoul", "ModelViewControllerGremlin", "BusinessDelegateBogey",
    "DataAccessObjectDybbuk", "ServiceLocatorShuck", "TransferObjectTroll", "CompositeEntityCockatrice", "ProxyPatternPixie", "BuilderPatternBogie",
    "FactoryMethodFamiliar", "AbstractFactoryApparition", "SingletonShadow", "AdapterAos-si", "BridgeBrownie", "FilterFachan", "InterceptingFilterHobgoblin",
    "FrontControllerHaint", "ModelViewControllerHob", "BusinessDelegateBoggart", "DataAccessObjectDullahan", "ServiceLocatorSpriggan", "TransferObjectTrow",
    "CompositeEntityCryptid", "ProxyPatternPuca", "BuilderPatternBarghest", "FactoryMethodFey", "AbstractFactoryAfanc", "SingletonSpecter",
    "AdapterAitvaras", "BridgeBoginki", "FilterFirbolg", "InterceptingFilterImp", "FrontControllerFury", "ModelViewControllerMara",
    "BusinessDelegateBogey", "DataAccessObjectDrekavac", "ServiceLocatorSiren", "TransferObjectTikbalang", "CompositeEntityChaneque",
    "ProxyPatternPuck", "BuilderPatternBoggart", "FactoryMethodFae", "AbstractFactoryAitvaras", "SingletonShade", "AdapterAlp",
    "BridgeBanshee", "FilterFomor", "InterceptingFilterGoblin", "FrontControllerGhoul", "ModelViewControllerGremlin", "BusinessDelegateBogey",
    "DataAccessObjectDybbuk", "ServiceLocatorShuck", "TransferObjectTroll", "CompositeEntityCockatrice", "ProxyPatternPixie", "BuilderPatternBogie",
    "FactoryMethodFamiliar", "AbstractFactoryApparition", "SingletonShadow", "AdapterAos-si", "BridgeBrownie", "FilterFachan", "InterceptingFilterHobgoblin",
    "FrontControllerHaint", "ModelViewControllerHob", "BusinessDelegateBoggart", "DataAccessObjectDullahan", "ServiceLocatorSpriggan", "TransferObjectTrow",
    "CompositeEntityCryptid", "ProxyPatternPuca", "BuilderPatternBarghest", "FactoryMethodFey", "AbstractFactoryAfanc"
];
document.addEventListener('DOMContentLoaded', function() {
    token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '../login';
        return;
    }

    const difficultyInterval = localStorage.getItem('streamDifficultyInterval');
    if (difficultyInterval) {
        greenSquareInterval = parseInt(difficultyInterval);
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    checkChannelExists(token)
        .then(() => {
            initGame();
        })
        .catch(error => {
            console.error('Ошибка инициализации:', error);
            alert('Ошибка загрузки игры. Проверьте соединение.');
        });
});

async function checkChannelExists() {
    try {
        const response = await fetch(`${API_BASE_URL}/game/load`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const gameState = await response.json();
            if (!gameState.nickname) {
                window.location.href = 'chanel';
            }
        } else if (response.status === 404) {
            window.location.href = 'chanel';
        } else {
            throw new Error('Ошибка проверки канала');
        }
    } catch (error) {
        console.error('Ошибка проверки канала:', error);
        throw error;
    }
}

async function initGame() {
    createSquares();
    loadStreamSettings();

    try {
        const difficultyLevelStr = localStorage.getItem('streamDifficultyLevel');
        let level = 3;

        if (difficultyLevelStr) {
            level = parseInt(difficultyLevelStr);
            if (isNaN(level)) {
                level = 3;
                console.warn('Некорректный уровень сложности, установлено значение по умолчанию: 3');
            }
        } else {
            console.warn('Уровень сложности не найден в localStorage, установлено значение по умолчанию: 3');
        }

        console.log('Starting stream with level:', level);

        currentSession = await startStream(level);

        if (!currentSession) {
            console.error('Не удалось создать сессию стрима');
            alert('Не удалось начать стрим. Попробуйте еще раз.');
            window.location.href = 'start_stream';
            return;
        }

        startGame();
    } catch (error) {
        console.error('Ошибка инициализации игры:', error);
        alert('Не удалось начать стрим. Проверьте соединение.');
        window.location.href = 'start_stream';
    }
}

async function startStream(level) {
    try {
        const response = await fetch(`${API_BASE_URL}/game/stream/start?level=${level}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const sessionData = await response.json();
            if (sessionData.remainingTimeMs === undefined) {
                sessionData.remainingTimeMs = 60000;
            }
            return sessionData;
        } else {
            const errorText = await response.text();
            console.error('Ошибка начала стрима:', errorText);

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwtToken');
                window.location.href = '../login';
                return null;
            }

            throw new Error(errorText || 'Ошибка начала стрима');
        }
    } catch (error) {
        console.error('Ошибка начала стрима:', error);

        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            alert('Ошибка соединения с сервером. Проверьте интернет-соединение.');
        }

        throw error;
    }
}

function loadStreamSettings() {
    const streamTitle = localStorage.getItem('streamTitle') || 'Без названия';
    const streamCategory = localStorage.getItem('streamCategory') || 'Игры';
    const streamDifficulty = localStorage.getItem('streamDifficulty') || 'medium';

    streamTitleElement.textContent = streamTitle;
    streamCategoryElement.textContent = streamCategory;

    const difficultyDisplay = document.getElementById('streamDifficulty');
    if (difficultyDisplay) {
        const difficultyNames = {
            'very-easy': 'Очень легко',
            'easy': 'Легко',
            'medium': 'Средне',
            'hard': 'Сложно',
            'very-hard': 'Очень сложно'
        };
        difficultyDisplay.textContent = difficultyNames[streamDifficulty] || 'Средне';
    }
}

function createSquares() {
    gridElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const square = document.createElement('button');
        square.className = 'square';

        square.addEventListener('click', () => {
            const isGoodClick = square.classList.contains('green');
            if (isGoodClick) {
                square.dataset.clicked = "true"; // отметили, что квадрат был нажат
            }
            handleSquareClick(isGoodClick);
        });

        gridElement.appendChild(square);
    }
}

async function sendClickToServer(isGoodClick) {
    try {
        const response = await fetch(`${API_BASE_URL}/game/stream/click?clickStatus=${isGoodClick}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorText = await response.text();
            console.error('Ошибка сервера при клике:', errorText);

            if (response.status === 404 || response.status === 500) {
                console.error('Сессия может быть завершена, перенаправляем...');
                window.location.href = '../login';
            }

            return null;
        }
    } catch (error) {
        console.error('Ошибка отправки клика:', error);
        return null;
    }
}

function startGame() {
    if (isGameActive || !currentSession) {
        console.warn('Игра не может быть запущена: isGameActive=', isGameActive, 'currentSession=', currentSession);
        return;
    }

    isGameActive = true;
    updateUI();

    gameInterval = setInterval(() => {
        if (!currentSession) {
            console.warn('Таймер остановлен: currentSession is null');
            clearInterval(gameInterval);
            return;
        }

        currentSession.remainingTimeMs -= 1000;

        if (currentSession.remainingTimeMs <= 0) {
            endGame();
            return;
        }

        updateTimer();
    }, 1000);

    colorInterval = setInterval(changeRandomSquare, greenSquareInterval);

    startChat();

    changeRandomSquare();
}

function changeRandomSquare() {
    if (!isGameActive) return;

    const prevGreen = document.querySelector('.square.green');
    if (prevGreen && !prevGreen.dataset.clicked) {
        processSquareEvent(false, true); // промах только если не кликнули
    }

    const squares = document.querySelectorAll('.square');
    squares.forEach(sq => {
        sq.classList.remove('green');
        sq.removeAttribute('data-clicked');
    });

    const randomIndex = Math.floor(Math.random() * 9);
    squares[randomIndex].classList.add('green');
    squares[randomIndex].dataset.clicked = "false";

    lastGreenSquareTime = Date.now();
}

function startChat() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            addChatMessage(getRandomChatMessage());
        }, i * 1000);
    }

    chatInterval = setInterval(() => {
        if (Math.random() > 0.5) {
            addChatMessage(getRandomChatMessage());
        }
    }, CHAT_MESSAGE_INTERVAL);
}

function getRandomChatMessage() {
    const username = userNames[Math.floor(Math.random() * userNames.length)];
    const message = chatMessages[Math.floor(Math.random() * chatMessages.length)];
    return `${username}: ${message}`;
}

function addChatMessage(message, type = 'normal') {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${type}`;
    messageElement.textContent = message;

    chatMessagesElement.appendChild(messageElement);
    chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

function updateUI() {
    if (!currentSession) {
        console.warn('Не удалось обновить UI: currentSession is null');
        return;
    }

    scoreElement.textContent = `${currentSession.correctClicks || 0}`;
    viewersElement.textContent = `${currentSession.currentOnline || 0}`;
    donationsElement.textContent = `${currentSession.income || 0}`;
    accuracyElement.textContent = `${Math.round(currentSession.accuracy || 0)}%`;
    updateTimer();
}

function updateTimer() {
    if (!currentSession) {
        console.warn('Не удалось обновить таймер: currentSession is null');
        return;
    }

    const seconds = Math.floor(currentSession.remainingTimeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function endGame() {
    if (!isGameActive) return;

    console.log('Завершение игры...');

    clearInterval(gameInterval);
    clearInterval(colorInterval);
    clearInterval(chatInterval);
    if (autoSaveInterval) clearInterval(autoSaveInterval);

    isGameActive = false;

    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('green');
    });

    try {
        const stats = await finishStream();
        console.log('Статистика с сервера:', stats);

        if (stats) {
            showResults(stats);
        } else if (currentSession) {
            console.log('Используем текущую сессию для результатов');
            showResults(currentSession);
        } else {
            console.error('Нет данных для отображения результатов');
            showResults({
                currentOnline: 0,
                correctClicks: 0,
                accuracy: 0,
                income: 0
            });
        }
    } catch (error) {
        console.error('Ошибка завершения стрима:', error);
        if (currentSession) {
            showResults(currentSession);
        } else {
            showResults({
                currentOnline: 0,
                correctClicks: 0,
                accuracy: 0,
                income: 0
            });
        }
    }
}

async function finishStream() {
    try {
        const response = await fetch(`${API_BASE_URL}/game/stream/finish`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorText = await response.text();
            console.error('Ошибка завершения стрима:', errorText);
            return null;
        }
    } catch (error) {
        console.error('Ошибка завершения стрима:', error);
        return null;
    }
}

async function processSquareEvent(isGoodClick, isMissed = false) {
    if (!isGameActive || !currentSession) return;

    try {
        const currentTime = currentSession.remainingTimeMs;
        const updatedSession = await sendClickToServer(isGoodClick);

        if (updatedSession) {
            updatedSession.remainingTimeMs = currentTime;
            currentSession = updatedSession;
            updateUI();

            if (isGoodClick) {
                const greenSquare = document.querySelector('.square.green');
                if (greenSquare) greenSquare.classList.remove('green');
                lastGreenSquareTime = Date.now();
            }

            if (isMissed) {
                const greenSquare = document.querySelector('.square.green');
                if (greenSquare) greenSquare.classList.remove('green');
            }
        }
    } catch (error) {
        console.error('Ошибка обработки события квадрата:', error);
    }
}

function handleSquareClick(isGoodClick) {
    processSquareEvent(isGoodClick, false);
}


function showResults(stats) {
    console.log('Показ результатов:', stats);

    const totalEarnings = (stats.correctClicks || 0) * 2 + (stats.currentOnline || 0) * 5 + (stats.income || 0);

    const overlay = document.createElement('div');
    overlay.className = 'stream-results-overlay active';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'stream-results active';
    resultsContainer.style.cssText = `
    background: var(--content-bg);
    padding: 2rem;
    border-radius: 15px;
    border: 3px solid var(--accent-color);
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 10001;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

    resultsContainer.innerHTML = `
        <h2 class="results-title">Стрим завершен!</h2>
        <div class="results-content">
            <div class="result-item">
                <span class="result-label">Зрителей:</span>
                <span class="result-value">${stats.averageOnline || 0}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Счет:</span>
                <span class="result-value">${stats.correctClicks || 0}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Точность:</span>
                <span class="result-value">${Math.round(stats.accuracy || 0)}%</span>
            </div>
            <div class="result-item">
                <span class="result-label">Донаты:</span>
                <span class="result-value">${stats.income || 0}</span>
            </div>
        </div>
        <button class="game-button results-close">
            Вернуться в меню
        </button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(resultsContainer);

    document.body.style.overflow = 'hidden';

    const closeButton = resultsContainer.querySelector('.results-close');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(resultsContainer);
        document.body.style.overflow = '';
        window.location.href = '../login';
    });

    resultsContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

window.addEventListener('beforeunload', async (e) => {
    if (isGameActive && currentSession) {
        fetch(`${API_BASE_URL}/game/stream/save?remainingTime=${currentSession.remainingTimeMs}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            keepalive: true
        }).catch(error => {
            console.error('Ошибка сохранения при закрытии:', error);
        });
    }
});

async function saveStream(remainingTimeMs) {
    try {
        const response = await fetch(`${API_BASE_URL}/game/stream/save?remainingTime=${remainingTimeMs}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log('Стрим успешно сохранен');
            return true;
        } else {
            const errorText = await response.text();
            console.error('Ошибка сохранения стрима:', errorText);
            return false;
        }
    } catch (error) {
        console.error('Ошибка сохранения стрима:', error);
        return false;
    }
}