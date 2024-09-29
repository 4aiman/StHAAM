
//////
let fs = require("fs")
let memoryjs = require('memoryjs')
// RALibRetro
let process_name = "RALibretro.exe"
let module_name = 'mednafen_saturn_libretro.dll'
// RetroArch
process_name = "retroarch.exe"
module_name = 'kronos_libretro.dll'

let process = memoryjs.openProcess(process_name)
console.log(process)
// get specific dll inside of an EXE
//let modules = memoryjs.getModules(process.th32ProcessID);
// dwSize: 304,
// th32ProcessID: 3996,
// cntThreads: 26,
// th32ParentProcessID: 9416,
// pcPriClassBase: 8,
// szExeFile: 'RALibretro.exe',
// handle: 644,
// modBaseAddr: 140699475116032
let core = memoryjs.findModule(module_name, process.th32ProcessID);
console.log(core)
// modBaseAddr: 140714432069632,
// modBaseSize: 24608768,
// szExePath: 'F:\\Games\\Console\\RALibretro\\Cores\\mednafen_saturn_libretro.dll',
// szModule: 'mednafen_saturn_libretro.dll',
// th32ProcessID: 3996,
// GlblcntUsage: 1

let hex2int = function(hex) {
    let result = parseInt(Number(hex), 10)
    return result
}

let char_tbl = {
    [hex2int("0x00")] : ' ',
    [hex2int("0x41")] : 'A',
    [hex2int("0x42")] : 'B',
    [hex2int("0x43")] : 'C',
    [hex2int("0x44")] : 'D',
    [hex2int("0x45")] : 'E',
    [hex2int("0x46")] : 'F',
    [hex2int("0x47")] : 'G',
    [hex2int("0x48")] : 'H',
    [hex2int("0x49")] : 'I',
    [hex2int("0x4a")] : 'J',
    [hex2int("0x4b")] : 'K',
    [hex2int("0x4c")] : 'L',
    [hex2int("0x4d")] : 'M',
    [hex2int("0x4e")] : 'N',
    [hex2int("0x4f")] : 'O',
    [hex2int("0x50")] : 'P',
    [hex2int("0x51")] : 'Q',
    [hex2int("0x52")] : 'R',
    [hex2int("0x53")] : 'S',
    [hex2int("0x54")] : 'T',
    [hex2int("0x55")] : 'U',
    [hex2int("0x56")] : 'V',
    [hex2int("0x57")] : 'W',
    [hex2int("0x58")] : 'X',
    [hex2int("0x59")] : 'Y',
    [hex2int("0x5a")] : 'Z',

    [hex2int("0x61")] : 'a',
    [hex2int("0x62")] : 'b',
    [hex2int("0x63")] : 'c',
    [hex2int("0x64")] : 'd',
    [hex2int("0x65")] : 'e',
    [hex2int("0x66")] : 'f',
    [hex2int("0x67")] : 'g',
    [hex2int("0x68")] : 'h',
    [hex2int("0x69")] : 'i',
    [hex2int("0x6a")] : 'j',
    [hex2int("0x6b")] : 'k',
    [hex2int("0x6c")] : 'l',
    [hex2int("0x6d")] : 'm',
    [hex2int("0x6e")] : 'n',
    [hex2int("0x6f")] : 'o',
    [hex2int("0x70")] : 'p',
    [hex2int("0x71")] : 'q',
    [hex2int("0x72")] : 'r',
    [hex2int("0x73")] : 's',
    [hex2int("0x74")] : 't',
    [hex2int("0x75")] : 'u',
    [hex2int("0x76")] : 'v',
    [hex2int("0x77")] : 'w',
    [hex2int("0x78")] : 'x',
    [hex2int("0x79")] : 'y',
    [hex2int("0x7a")] : 'z',

    [hex2int("0x21")] : '!',
    [hex2int("0x2e")] : '.',
    [hex2int("0x2f")] : '/',
    [hex2int("0x26")] : '&',
    [hex2int("0x2b")] : '+',
    [hex2int("0x2c")] : ',',
    [hex2int("0x30")] : '0',
    [hex2int("0x31")] : '1',
    [hex2int("0x32")] : '2',
    [hex2int("0x33")] : '3',
    [hex2int("0x34")] : '4',
    [hex2int("0x35")] : '5',
    [hex2int("0x36")] : '6',
    [hex2int("0x37")] : '7',
    [hex2int("0x38")] : '8',
    [hex2int("0x39")] : '9',
    [hex2int("0x3a")] : ':',
    [hex2int("0x3b")] : ';',
    [hex2int("0x3f")] : '?',
    [hex2int("0xb0")] : '-',    
}

1011100
100000

let tint2char = function(int) {    
    return char_tbl[int]
}

// CE gives module name + offset (hex)
let offsets = {
    // RALibretro
    //discrepancy : hex2int("0x77A340"), // 7840576
    //RetroArch
    //discrepancy : hex2int("0xAB03040"), // 5666532 -- reads names, HP correctly
    discrepancy : (process_name=='retroarch.exe')?+179318848:hex2int("0x604CDE2"), // 5666532 
    //  In RALR map_id is at 0x792346; with the discrepancy of 0x77A340, that gives us the address of the map_id: 0x18006
    // In RA map_id is at 0x736F90; with the discrepancy of 0x71EF8A, that gives us the address of the map_id: 0x18006
    // In RA map_id is at 0x7350E8; with the discrepancy of 0x71EF8A, that gives us the address of the map_id: 0x18006
    map_id : hex2int("0x18006")-78340702, 
    event_id : hex2int("0x1cf8ac"), 
    eid : hex2int("0x1cf8b6"), // 10D206 // C26B0
    ingame_indicator : hex2int("0x121510"),
    savefile_name : [
        hex2int("0x120731"),
        hex2int("0x120730"),
        hex2int("0x120733"),
        hex2int("0x120732"),
        hex2int("0x120735"),
        hex2int("0x120734"),   
    ],
    hp : {
        arthur : hex2int("0x1207b0"),
        melody : hex2int("0x12087c"),
        rodi   : hex2int("0x120948"),
        basso  : hex2int("0x120a14"),
        akane  : hex2int("0x120ae0"),
        forte  : hex2int("0x120bac"),
        doyle  : hex2int("0x120c78"),
        lisa   : hex2int("0x120d44"),
        enemy1 : hex2int("0x120e10"),
        enemy2 : hex2int("0x120edc"),
        enemy3 : hex2int("0x120fa8"),
        enemy4 : hex2int("0x121074"),
        enemy5 : hex2int("0x121140"),
    },
    max_hp : {
        arthur : hex2int("0x12073c"),
        melody : hex2int("0x120808"),
        rodi   : hex2int("0x1208d4"),
        basso  : hex2int("0x1209a0"),
        akane  : hex2int("0x120a6c"),
        forte  : hex2int("0x120b38"),
        doyle  : hex2int("0x120c04"),
        lisa   : hex2int("0x120cd0"),
        enemy1 : hex2int("0x120d9c"),
        enemy2 : hex2int("0x120f34"),
    },
    mp : {
        arthur : hex2int("0x1207b2"),
        melody : hex2int("0x12087e"),
        rodi   : hex2int("0x12094a"),
        basso  : hex2int("0x120a16"),
        akane  : hex2int("0x120ae2"),
        forte  : hex2int("0x120bae"),
        lisa   : hex2int("0x120d46"),
        enemy1 : hex2int("0x120e12"),
        enemy2 : hex2int("0x120ede"),
    },
    max_mp : {
        arthur : hex2int("0x12073e"),
        melody : hex2int("0x12080a"),
        rodi   : hex2int("0x1208d6"),
        basso  : hex2int("0x1209a2"),
        akane  : hex2int("0x120a6e"),
        forte  : hex2int("0x120b3a"),
        lisa   : hex2int("0x120cd2"),
        enemy1 : hex2int("0x120d9e"),
        enemy2 : hex2int("0x120e2a"),
    },
    status : {
        arthur : hex2int("0x1207eb"),
        melody : hex2int("0x1208b7"),
        rodi   : hex2int("0x120983"),
        basso  : hex2int("0x120a4f"),
        akane  : hex2int("0x120b1b"),
        forte  : hex2int("0x120be7"),
        doyle  : hex2int("0x120cb3"),
        lisa   : hex2int("0x120d7f"),
    },
    position : {
        x: hex2int("0x1219dc"),
        y: hex2int("0x1219e4"),
        z: hex2int("0x1219e1"),
        z2: hex2int("0x1219e0"),
        north: hex2int("0x1ffc54"),
        west:  hex2int("0x1ffc58"),
        direction: hex2int("0x121a0c")
    },
    steps : {
        area: hex2int("0x121512")
    },
    characters: {
        party:hex2int("0x121501"),
        acquired:hex2int("0x121503"),
    },
    pixies : {
        0 : hex2int("0x1215d8"),
        1 : hex2int("0x1215da"),
        2 : hex2int("0x1215db"),
        3 : hex2int("0x1215dc"),
        4 : hex2int("0x1215dd"),
        5 : hex2int("0x1215de"),
        6 : hex2int("0x1215df"),
    },

}


function readm(offset, type) {
    let module_address = core.modBaseAddr
    let discrepancy = offsets.discrepancy
    if (process_name == "retroarch.exe") {
        module_address = 0
        //discrepancy = 0
    }
    return memoryjs.readMemory(process.handle, module_address+discrepancy+offset, type || memoryjs.UINT16)
}

// use this to send data only *1 in a throttle* readings
let throttle = 1
let throttle_counter = 0
let last_map_id
let mapped_data = {}
let maps = {}
let last_pos = {}
let reset_cell_size = true
let reset_cell_size_sent = false
let last_ingame
let last_worldmap
let WSS

if (fs.existsSync('./maps.json')) {
    maps = require ('./maps.json')
}

function new_ws_server(port) {
    let WS				= require('ws')
    let lcrypto			= require('crypto')
	WSS = new WS.Server({port:port})
	console.log('listening on ws://'+ 'localhost' +":"+ port)
	WSS.send = function (client_id, message) {
		
		let json_data = JSON.stringify(message)
		for (let WSC of WSS.clients) {
			if (WSC.id == client_id || client_id == "broadcast" || client_id == WSC.client_channel ) {
				WSC.send(json_data)												
			}
		}
	}

    function WSSconnect(ws_client) {
		console.log('[WSS] A new client has appeared!')
		ws_client.join_time = new Date()
        ws_client.on('pong', function() {			
            // this will re-animate a "dead" client so WSS_dead_clients_check won't kill it
            this.alive = true
        })

    }

    WSS.on('connection', WSSconnect)


    setInterval(
        function() {
            let data = {
                hp : {},
                max_hp : {},
                mp : {},
                max_mp : {},
                status : {},
            }

            // pixies ---------------------------------------------------------------
            let pixies = []
            for (let idx in offsets.pixies) {
                let batch = (readm(offsets.pixies[idx], memoryjs.UBYTE)).toString(2)
                    pixies[idx] = ('0'.repeat(8-batch.length) + batch).split("").reverse().join("")
            }

            data.pixies = pixies.join("").split("")
            
            data.pixies_flags = {
                leprechaunt : {
                    Dana    : data.pixies[54],
                    Tak     : data.pixies[55],
                    Morgan	: data.pixies[40],
                    Kokus	: data.pixies[41],
                    Zircon	: data.pixies[42],
                    Mangus	: data.pixies[43],
                    Darbie	: data.pixies[44],
                    Solo	: data.pixies[45],
                    Stilt	: data.pixies[46],
                    Eric    : data.pixies[47],
                },
                succubus    : {
                    Muran	 : data.pixies[34],
                    Dahlia	 : data.pixies[35],
                    Roberia	 : data.pixies[36],
                    Lacey	 : data.pixies[37],
                    Orlea	 : data.pixies[38],
                    Ripanos	 : data.pixies[39],
                    Kathorea : data.pixies[24],
                    Viola	 : data.pixies[25],
                    Lunaria	 : data.pixies[26],
                    Natasha	 : data.pixies[27],
                },
                incubus     : {
                    Lantano	 : data.pixies[28],
                    Enjewel	 : data.pixies[29],
                    Masakari : data.pixies[30],
                    Krupis	 : data.pixies[31],
                    Liknis	 : data.pixies[48],
                    Cypress	 : data.pixies[49],
                    Aster	 : data.pixies[50],
                    Adonis	 : data.pixies[51],
                    Croton	 : data.pixies[52],
                    Boris	 : data.pixies[53],
                },
                pixie       : {
                    Maple	: data.pixies[6],
                    Cherry	: data.pixies[7],
                    Willow	: data.pixies[16],
                    Cedar	: data.pixies[17],
                    Palm	: data.pixies[18],
                    Apple	: data.pixies[19],
                    Lime	: data.pixies[20],
                    Pear	: data.pixies[21],
                    Plum	: data.pixies[22],
                    Baldric	: data.pixies[23],
                },
                fairy       : {
                    Daisy	 :  data.pixies[8],
                    Iris	 :  data.pixies[9],
                    Camellia :  data.pixies[10],
                    Peony	 :  data.pixies[11],
                    Lily	 :  data.pixies[12],
                    Azalea	 :  data.pixies[13],
                    Sisal	 :  data.pixies[14],
                    Mimosa	 :  data.pixies[15],
                    Primrose :  data.pixies[32],
                    Clyde	 :  data.pixies[33],
                },
            }
            // ------ ---------------------------------------------------------------

            data.characters = readm(offsets.characters.acquired).toString(2)
            data.party = readm(offsets.characters.party).toString(2)

            let acquired_characters = {}
            if (data.characters[0]==1) { acquired_characters.arthur = true }
            if (data.characters[1]==1) { acquired_characters.melody = true }
            if (data.characters[2]==1) { acquired_characters.rodi   = true }
            if (data.characters[3]==1) { acquired_characters.basso  = true }
            if (data.characters[4]==1) { acquired_characters.akane  = true }
            if (data.characters[5]==1) { acquired_characters.forte  = true }
            if (data.characters[6]==1) { acquired_characters.doyle  = true }
            if (data.characters[7]==1) { acquired_characters.lisa   = true }

            let party_characters = {}
            if (data.party[0]==1) { party_characters.arthur = true }
            if (data.party[1]==1) { party_characters.melody = true }
            if (data.party[2]==1) { party_characters.rodi   = true }
            if (data.party[3]==1) { party_characters.basso  = true }
            if (data.party[4]==1) { party_characters.akane  = true }
            if (data.party[5]==1) { party_characters.forte  = true }
            if (data.party[6]==1) { party_characters.doyle  = true }
            if (data.party[7]==1) { party_characters.lisa   = true }

            data.party_characters_list = []
            for (let char in party_characters) {
                data.party_characters_list.push(char)
            }

            data.acquired_characters_list = []
            for (let char in acquired_characters) {
                data.acquired_characters_list.push(char)
            }

            
            for (let char of data.party_characters_list) {
                data.hp[char] = readm(offsets.hp[char])
                data.max_hp[char] = readm(offsets.max_hp[char])
                data.mp[char] = readm(offsets.mp[char])
                data.max_mp[char] = readm(offsets.max_mp[char])
                

                let char_status = readm(offsets.status[char], memoryjs.BYTE)
                
                let cstat = 'Healthy'
                if (char_status != 0) {
                    if (char_status<=4) {
                        cstat = 'Poisoned'
                    } else if (char_status>4) {
                        cstat = 'Fatally Ill'
                    }
                }
                data.status[char] = cstat
            }


            let direction = readm(offsets.position.direction, memoryjs.UINT16)
            let steps_in_area = readm(offsets.steps.area)
            let current_location = readm(offsets.eid, memoryjs.UINT16_BE);
            let current_location1 = readm(offsets.event_id, memoryjs.UINT16_BE);
            let worldmap = readm(offsets.map_id, memoryjs.UINT8)
            data.location_id = current_location
            data.location_id1 = current_location1
            data.steps_in_area = steps_in_area
            data.worldmap = worldmap

            data.position = {
              x: Math.round(readm(offsets.position.x, memoryjs.INT16)/16)/10,
              y: Math.round(readm(offsets.position.y, memoryjs.INT16)/16)/10,
              z: Math.round(readm(offsets.position.z, memoryjs.INT8)),
              z2: Math.round(readm(offsets.position.z2, memoryjs.INT8)),
              north: readm(offsets.position.north, memoryjs.UINT8),
              west: readm(offsets.position.west, memoryjs.UINT8),
              direction : direction/(65536/360),
            }


            if (current_location && (last_map_id != current_location) || worldmap != last_worldmap) {
                data.map_changed = true
                maps[last_worldmap] = maps[last_worldmap] || {}
                maps[last_worldmap][last_map_id] = mapped_data
                mapped_data = maps[worldmap]?.[current_location] || {}
                last_map_id = current_location
                last_worldmap = worldmap
                mapped_data.entrance = {x : data.position.x, y : data.position.y }
                mapped_data.map_name = current_location
                mapped_data.event_id = current_location1
                mapped_data.location = data.worldmap
                last_pos.x = data.position.x
                last_pos.y = data.position.y
                reset_cell_size = true
            }

            
            let ingame = (readm(offsets.ingame_indicator, memoryjs.UINT8) == 1)

            if ( data.worldmap == 244) {
                //data.reset_cell_size = true
            } else {
                if ( ingame && 
                        (  (last_pos.y != data.position.y) || 
                        (last_pos.x != data.position.x) || 
                        (  (ingame != last_ingame) && 
                            last_ingame == 0
                        )
                    )
                ) {
                    if (reset_cell_size_sent) {
                        reset_cell_size = false
                        reset_cell_size_sent = false
                    }
                    
                    mapped_data[data.position.x] = mapped_data[data.position.x] || {}
                    mapped_data[data.position.x][data.position.y] = mapped_data[data.position.x][data.position.y] || {}
                    //if ( Math.abs(last_pos.y - data.position.y) + Math.abs(last_pos.x - data.position.x) > 1) {
                        mapped_data[data.position.x][data.position.y] = mapped_data[data.position.x][data.position.y] || {}
                        mapped_data[data.position.x][data.position.y].additional = mapped_data[data.position.x][data.position.y].additional || {}
                        // this breaks older paths, need multiple Y coords!
                        //mapped_data[data.position.x][data.position.y].additional[last_pos.x] = last_pos.y
                        mapped_data[data.position.x][data.position.y].additional[last_pos.x] = mapped_data[data.position.x][data.position.y].additional[last_pos.x] || {}
                        mapped_data[data.position.x][data.position.y].additional[last_pos.x][last_pos.y] = true
                        mapped_data[data.position.x][data.position.y].z = mapped_data[data.position.x][data.position.y].z || {}
                        if (data.position.z> 0) {mapped_data[data.position.x][data.position.y].z.up = true}
                        if (data.position.z< 0) {mapped_data[data.position.x][data.position.y].z.down = true}
                        if (data.position.z==0) {mapped_data[data.position.x][data.position.y].z.middle = true}
                        mapped_data[data.position.x][data.position.y].z.z1 = data.position.z
                        mapped_data[data.position.x][data.position.y].z.z2 = data.position.z2
                    //} else {
                        //mapped_data[data.position.x][data.position.y] = true
                    //}   
                } else {
                    
                }
            }

            last_ingame = ingame
            last_pos.x = data.position.x
            last_pos.y = data.position.y
            data.mapped_data = mapped_data
            data.reset_cell_size = reset_cell_size
            ////////////
            
            let hero_name = []
            let hero_name1 = []
            
            let c = 0
            for (let i of offsets.savefile_name) {                                
                hero_name1[c] = readm(i, memoryjs.CHAR)                
                hero_name[c] = tint2char(hero_name1[c])
                c = c+1
            }
            data.hero_name = hero_name
            data.hero_name1 = hero_name1
            
            throttle_counter = throttle_counter + 1
            if ((throttle_counter > throttle) || data.map_changed) {
                throttle_counter = 0
                reset_cell_size_sent = true
                reset_cell_size = false
                WSS.send ( 
                    null, 
                    data
                )
            }            
        },
        100
    )
}

new_ws_server(13531)

let save_maps = function () {
    fs.writeFile('./maps.json', JSON.stringify(maps || {}) , function() {
        setTimeout(
            save_maps,
            5000
        )
    })
}

save_maps()


// let { spawn, exec } = require('child_process');
// let ui = spawn('ui.html', { shell: true, detached : true,   stdio: 'ignore' });
// ui.unref();
  


//memoryjs.closeProcess(process.handle);