//////
// This works in RetroArch of all things.
// RaLibRetro fucks everything up by its memory editor.
// If you want this to work in RaLibRetro "as is" - do *NOT* open the memory inspector! Do *NOT* scroll it!
// This once I want to use shaders anyway, so there's no avoiding RetroArch. Shame Mednafen can't upscale.
//////
let fs = require("fs")
let memoryjs = require('memoryjs')
let { exit, off } = require("process")

// first try ralibretro, then retroarch. Case sensitive
let process_names = ["RALibretro.exe", "retroarch.exe", ]
let process_name
let process 
let core_offset = 0

for (let pname of process_names) {
    try {
        process = memoryjs.openProcess(pname)
        process_name = pname        
        console.log(["Found process:", pname].join(" "))
        break
    } catch (err) {
        console.log(["Couldn't open", pname, "..."].join(" "))
    }
}

if (!process_name) {
    console.log(["Couldn't open any core. Check that an emulator is actually launched and the core is loaded. Exiting."].join(" "))
    exit()
}


try {
    let module_name = 'mednafen_saturn_libretro.dll'
    console.log(["Probing mednafen core:", module_name].join(" "))    
    let core = memoryjs.findModule(module_name, process.th32ProcessID);
    console.log(["Found Mednafen core.", "It's base address will be used as an additional memory offset value."].join(" "))    
    core_offset = core.modBaseAddr
} catch (err) {
    console.log("You're not running Mednafen core. Assuming it's Kronos then.")
}


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

let tint2char = function(int) {    
    return char_tbl[int]
}

// CE gives module name + offset (hex)
let offsets = {
    //discrepancy : hex2int("0x77A340"), // 7840576
    discrepancy : hex2int("0x77A340"), // 7840576    
    map_id : hex2int("0x18006"), 
    event_id : hex2int("0x1cf8ac"), 
    eid : hex2int("0x1cf8b6"),
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
    colors : {
        depth : hex2int("0x17b791"),
        window : {
            red   : hex2int("0x17b7a1"),
            green : hex2int("0x17b7a0"),        
            blue : hex2int("0x17b798"),    
        },
        frame : {
            red   : hex2int("0x17b789"),
            green : hex2int("0x17b79b"),        
            blue  : hex2int("0x17b799"),    
        },
    }

}

if (core_offset == 0) { 
    // This isn't needed if we're running Mednafen/

    // This is a consistent start of a lowram in Kronos, though. 
    // If memory inspector is present (i.e. you're on RaLibretro), this will find that instead of the actual data. 
    // It's fine, though (unless you scroll said inspector; don't, duh!)
    let sig_work_ram_low  = "20 00 64 00 20 00 48 13 20 00 5c 13 20 00 5c 13" 

    // this is the copyright message: "OCYPIRHG(T)CS GE ANEETPRIRES,STL.D1 99 4LA LIRHGSTR SEREEV D    " 
    // but what we actually need is the "00 06 4A 09 00 06 4A 09 00 06 4A 09 00 06 4A 09" after that. Too bad it's too repetitive to be searched on its own
    // let sig_work_ram_high = "4F 43 59 50 49 52 48 47 28 54 29 43 53 20 47 45 20 41 4E 45 45 54 50 52 49 52 45 53 2C 53 54 4C 2E 44 31 20 39 39 20 34 4C 41 20 4C 49 52 48 47 53 54 52 20 53 45 52 45 45 56 20 44 20 20 20 20"

    // The above thing worked SOME times but then didn't other. 
    // So there's more fidgeting here and below when I do the  "+ 984 -13304" crap
    let sig_work_ram_high = "4E 49 31 3B 00 2A E4 8E 00 00 00 00 8E E4 11 A4 00 00 00 00 A4 11 05 61 11 07 06 06 00 DC 00 00 00 01 01 00 58 09 39 37 42 2E 4E 49 31 3B 00 2E E4 91 00 00 00 00 91 E4 15 F0 00 00 00 00 F0 15 0C 60 0B 04 0E 02 00 DC 00 00 00 01 01 00 58 0D 4E 49 52 54 4C 4E 43 2E 52 48 31 3B 00 00 00 00"
    let sig_work_ram_high_length = sig_work_ram_high.replaceAll(" ","").length / 2
    console.log(["High working ram sinature is", sig_work_ram_high_length,"bytes long."].join(" "))

    // To this day I *still* have no idea where the high ram relative to the low ram as it jumps around across the launches.
    // For all I know it can be placed *lower* than the low (at least in RaLibRetro) and be shredded in pieces.
    // For example: sig_work_ram_low - sig_work_ram_high = 0x216000 (2187264) 
    // Most likely I'm looking at a wrong place

    // this searches relatively fast in both emulators
    console.log("Searching sig_work_ram_low start pattern", sig_work_ram_low)
    let addr = memoryjs.findPattern(process.handle, sig_work_ram_low, 0, 0)
    // one needs to repeat the process in CheatEngine, but not in memoryjs. No idea why
    //addr = memoryjs.findPattern(process.handle, sig_work_ram_low, 0, addr+1)
    console.log("Found sig_work_ram_low address", addr, "0x"+ addr.toString(16))

    // This one... The search for this one is *incredibly* slow in RALibRetro, maybe the start of this pattern is really repetitive?
    console.log("Searching sig_work_ram_high start pattern", sig_work_ram_high)
    // we add the length of the pattern, since we're interested in what's around it rather than the signature itself
    let addr2 = memoryjs.findPattern(process.handle, sig_work_ram_high, 0, 0) + 984 -133040 // +3D8 - 207B0 to tread this as hiram start - 100000 //+ sig_work_ram_high_length
    console.log("Found sig_work_ram_high address", addr2, "0x"+ addr2.toString(16))

    console.log("Reading data from sig_work_ram_low+0x18006 (98310)", addr+98310, "0x"+ (addr+98310).toString(16))
    let pat = memoryjs.readMemory(process.handle, addr+98310, memoryjs.BYTE) // Map ID
    console.log("Reading data from sig_work_ram_high+0x207B0 (133040)", addr2, "0x"+ (addr2+133040).toString(16))
    let pat2 = memoryjs.readMemory(process.handle, addr2+133040, memoryjs.BYTE) // Arthur's HP


    // In the end we got our addreses
    offsets.discrepancy_lowram = addr
    offsets.discrepancy = addr2


    let h_name = []
    let h_name1 = []
    
    let c = 0
    for (let i of offsets.savefile_name) {
        h_name1[c] = readm(i, memoryjs.CHAR)//, 'hero\'s name ['+c+'] = '+tint2char(h_name1[c]))
        h_name[c] = tint2char(h_name1[c])
        c = c+1
    }

    // this is here for testing purposes. If thise is wrong - the thing isn't working properly ((
    console.log("Please check if these are correct: '92 0x5c' for 'MapId' in Desire Village; Your character's name (save file name) and his HP")
    console.log("MapID", pat, '0x'+(pat).toString(16))
    console.log(h_name.join("").trim()+"'s HP", pat2, '0x'+(pat2).toString(16))     
}


function readm(offset, type, descr) {
 if (core_offset > 0) {
    // we're running mednafen
    return memoryjs.readMemory(process.handle, core_offset+offsets.discrepancy+offset, type || memoryjs.UINT16)
 } else {
    // we're running Kronos or some unknown unsupported shit
    let res = 0
    let address = 0
    if (offset < 104857) {
        address = offsets.discrepancy_lowram+offset  
    } else {
        address = offsets.discrepancy+offset-1048576 // yeah, more duct tape
    }

    res = memoryjs.readMemory(process.handle, address, type || memoryjs.UINT16)
    if (descr) {
        console.log(address.toString(16) + 'h', type, descr, res )
    }
    return res
  } 
  throw("This should'n have happened")  
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

            let colors = {
                depth : readm(offsets.colors.depth, memoryjs.BYTE),
                window : {
                    red   : readm(offsets.colors.window.red,   memoryjs.BYTE),
                    green : readm(offsets.colors.window.green, memoryjs.BYTE),
                    blue  : readm(offsets.colors.window.blue , memoryjs.BYTE),
                },
                frame : {
                    red   : readm(offsets.colors.frame.red,   memoryjs.BYTE),
                    green : readm(offsets.colors.frame.green, memoryjs.BYTE),
                    blue  : readm(offsets.colors.frame.blue , memoryjs.BYTE),
                }
            }            
            data.colors = colors
            
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
  


// memoryjs.closeProcess(process.handle);