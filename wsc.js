let WS_SERVER_URL

async function get_public_access() {
	return 'localhost:13531' // LAN
}

let LOGIN = localStorage.getItem("TWC_LOGIN")
let PASSWORD = localStorage.getItem("TWC_PASS")
let ws_connecting = false
let ws_connected = false
let ws_connection_attempt_counter = 0
let WSC
let client_id
let total = 0

async function new_client(ws_server_url, id) {	
	WS_SERVER_URL = await get_public_access() || ws_server_url

	if (ws_connecting || !WS_SERVER_URL) { 
		return
	}

	ws_connecting = true
	console.log('[WSС]','Сonnecting to '+ WS_SERVER_URL)

	let ws_connect_counter_unique = 0
	
	ws_connect_counter_unique = ws_connect_counter_unique  + 1
	let WSC = new WebSocket('ws://'+WS_SERVER_URL)
	
	WSC.onopen = function () {		
		console.log('opened')
	}

	WSC.onerror = function(event){
		ws_connecting = false
		ws_connected = false
		console.log(event)
	}
	
	ws_connection_attempt_counter = ws_connection_attempt_counter - 1
	
	WSC.onmessage = function (message) {		
		show_message(message)
	}

	WSC.onerror = function(message) {
		ws_connecting = false
		ws_connected = false
		console.log("[WSC]", "[ERROR]", message)
	}
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


let playing = false


let character_data
let adata, astatus, bdata, bstatus, cdata, cstatus, ddata, dstatus
let aname, bname, cname, dname, anamew, bnamew, cnamew, dnamew
let ahpw, bhpw, chpw, dhpw
let ampw, bmpw, cmpw, dmpw
let ahpt, bhpt, chpt, dhpt
let ampt, bmpt, cmpt, dmpt
let ahp, bhp, chp, dhp
let amax_hp, bmax_hp, cmax_hp, dmax_hp
let amp, bmp, cmp, dmp
let amax_mp, bmax_mp, cmax_mp, dmax_mp
let pppointer
let plocation, plocation_id, plocation_text
let x_coord, y_coord, coord_text, pppointer_direction
let canvas, ctx, cgrid_size, tooltip
let overworld_map_image
let map_changed = true
let ui_initialized = false
let pixies_wrapper, pix_counter, fai_counter, suc_counter, inc_counter, lep_counter
let map_data
let pixies_row, pixies_fai, pixies_pix, pixies_suc, pixies_inc, pixies_lep
let pixies_fai_text, pixies_pix_text, pixies_suc_text, pixies_inc_text, pixies_lep_text
let pic_fai, pic_pix, pic_suc, pic_inc, pic_lep
let pix_count
let map_wrapper

let item_colors = [
	"rgb(105,105,105)",
	"rgb(46,139,87)",
	"rgb(25,25,112)",
	"rgb(128,128,0)",
	"rgb(178,34,34)",
	"rgb(255,0,0)",
	"rgb(255,165,0)",
	"rgb(255,255,0)",
	"rgb(0,0,205)",
	"rgb(124,252,0)",
	"rgb(186,85,211)",
	"rgb(0,255,255)",
	"rgb(255,0,255)",
	"rgb(30,144,255)",
	"rgb(238,232,170)",
	"rgb(221,160,221)",
	"rgb(255,20,147)",
	"rgb(255,160,122)",
	"rgb(152,251,152)",
	"rgb(135,206,250)"
	]
let item_colors_elements = []
let items_block 

let hex2int = function(hex) {
    let result = parseInt(Number(hex), 10)
    //console.log(hex,'=', result)
    return result
}


function prepare_ui() {	
	character_data = document.createElement("div")
	character_data.classList.add('characters_data')

	map_data = document.createElement("div")
	map_data.classList.add('map_data')

	// patry member #1
	adata    = document.createElement("div")	
	anamew    = document.createElement("div")
	aname    = document.createElement("span")
	ahpt     = document.createElement("span")
	ahpw     = document.createElement("div")
	ahp      = document.createElement("span")
	amax_hp  = document.createElement("span")
	ampw     = document.createElement("div")
	ampt     = document.createElement("span")
	amp      = document.createElement("span")
	amax_mp  = document.createElement("span")
	astatus  = document.createElement("img")	
	aname.style.fontWeight = '800'
	adata.classList.add('character_data')
	ahpw.classList.add('character_stat')
	ampw.classList.add('character_stat')
	anamew.classList.add('character_name_wrapper')
	anamew.appendChild(aname)
	anamew.appendChild(astatus)
	ahpw.appendChild(ahpt)
	ampw.appendChild(ampt)
	ahpw.appendChild(ahp)
	ahpw.appendChild(amax_hp)
	ampw.appendChild(amp)
	ampw.appendChild(amax_mp)
	adata.appendChild(anamew)
	adata.appendChild(ahpw)
	adata.appendChild(ampw)

	// patry member #2
	bdata    = document.createElement("div")	
	bnamew    = document.createElement("div")
	bname    = document.createElement("span")
	bhpw     = document.createElement("div")
	bhpt     = document.createElement("span")
	bhp      = document.createElement("span")
	bmax_hp  = document.createElement("span")
	bmpw     = document.createElement("div")
	bmpt     = document.createElement("span")
	bmp      = document.createElement("span")
	bmax_mp  = document.createElement("span")
	bstatus  = document.createElement("img")
	bname.style.fontWeight = '800'
	bdata.classList.add('character_data')
	bhpw.classList.add('character_stat')
	bmpw.classList.add('character_stat')
	bnamew.classList.add('character_name_wrapper')
	bnamew.appendChild(bname)
	bnamew.appendChild(bstatus)
	bhpw.appendChild(bhpt)
	bmpw.appendChild(bmpt)
	bhpw.appendChild(bhp)
	bhpw.appendChild(bmax_hp)
	bmpw.appendChild(bmp)
	bmpw.appendChild(bmax_mp)
	bdata.appendChild(bnamew)
	bdata.appendChild(bhpw)
	bdata.appendChild(bmpw)

	// patry member #3
	cdata    = document.createElement("div")	
	cnamew    = document.createElement("div")
	cname    = document.createElement("span")
	chpw     = document.createElement("div")
	chpt     = document.createElement("span")
	chp      = document.createElement("span")
	cmax_hp  = document.createElement("span")
	cmpw     = document.createElement("div")
	cmpt     = document.createElement("span")
	cmp      = document.createElement("span")
	cmax_mp  = document.createElement("span")
	cstatus  = document.createElement("img")
	cname.style.fontWeight = '800'
	cdata.classList.add('character_data')
	chpw.classList.add('character_stat')
	cmpw.classList.add('character_stat')
	cnamew.classList.add('character_name_wrapper')
	cnamew.appendChild(cname)
	cnamew.appendChild(cstatus)
	chpw.appendChild(chpt)
	cmpw.appendChild(cmpt)
	chpw.appendChild(chp)
	chpw.appendChild(cmax_hp)
	cmpw.appendChild(cmp)
	cmpw.appendChild(cmax_mp)
	cdata.appendChild(cnamew)
	cdata.appendChild(chpw)
	cdata.appendChild(cmpw)

	// patry member #4
	ddata    = document.createElement("div")	
	dnamew   = document.createElement("div")
	dname    = document.createElement("span")
	dhpw    = document.createElement("div")
	dhpt     = document.createElement("span")
	dhp      = document.createElement("span")
	dmax_hp  = document.createElement("span")
	dmpw     = document.createElement("div")
	dmpt     = document.createElement("span")
	dmp      = document.createElement("span")
	dmax_mp  = document.createElement("span")
	dstatus  = document.createElement("img")
	dname.style.fontWeight = '800'
	dnamew.classList.add('character_name_wrapper')
	ddata.classList.add('character_data')
	dhpw.classList.add('character_stat')
	dmpw.classList.add('character_stat')
	dnamew.appendChild(dname)
	dnamew.appendChild(dstatus)
	dhpw.appendChild(dhpt)
	dmpw.appendChild(dmpt)
	dhpw.appendChild(dhp)
	dhpw.appendChild(dmax_hp)
	dmpw.appendChild(dmp)
	dmpw.appendChild(dmax_mp)
	ddata.appendChild(dnamew)
	ddata.appendChild(dhpw)
	ddata.appendChild(dmpw)

	// map pointer
	pppointer = document.createElement('span')	
	pppointer.classList.add("map_pointer")
	// location bar
	plocation = document.createElement('div')
	plocation_text = document.createElement('span')
	plocation.classList.add('framed_text')
	// xm ym z coordinates
	x_coord = document.createElement('span')
	y_coord = document.createElement('span')
	coord_text = document.createElement('span')
	coord_text.style.marginRight = '5pt' // space cursor copy
	pppointer_direction = document.createElement('img')
	pppointer_direction.src = './data/images/cursor.png'
	pppointer_direction.style.width = '15px'
	pppointer_direction.style.position = 'relative';
	pppointer_direction.style.top = '2px';
	pppointer_direction.style.left = '0px';	
	pppointer_direction.style.display = 'inline-block'

	// pixies section
	pixies_wrapper = document.createElement('table')
	pixies_wrapper.classList.add('pixies_table')
	pixies_row = document.createElement('tr')
	pixies_fai = document.createElement('td')
	pixies_pix = document.createElement('td')
	pixies_suc = document.createElement('td')
	pixies_inc = document.createElement('td')
	pixies_lep = document.createElement('td')	
	pixies_fai_text = document.createElement('span')
	pixies_pix_text = document.createElement('span')
	pixies_suc_text = document.createElement('span')
	pixies_inc_text = document.createElement('span')
	pixies_lep_text = document.createElement('span')
	pic_fai = document.createElement('img')
	pic_pix = document.createElement('img')
	pic_suc = document.createElement('img')
	pic_inc = document.createElement('img')
	pic_lep = document.createElement('img')
	pic_fai.src = "./data/images/fai.png"
	pic_pix.src = "./data/images/pix.png"
	pic_suc.src = "./data/images/suc.png"
	pic_inc.src = "./data/images/inc.png"
	pic_lep.src = "./data/images/lep.png"
	pixies_fai.appendChild(pic_fai)
	pixies_pix.appendChild(pic_pix)
	pixies_suc.appendChild(pic_suc)
	pixies_inc.appendChild(pic_inc)
	pixies_lep.appendChild(pic_lep)
	pixies_fai.appendChild(pixies_fai_text)
	pixies_pix.appendChild(pixies_pix_text)
	pixies_suc.appendChild(pixies_suc_text)
	pixies_inc.appendChild(pixies_inc_text)
	pixies_lep.appendChild(pixies_lep_text)
	
	pixies_row.appendChild(pixies_fai)
	pixies_row.appendChild(pixies_pix)
	pixies_row.appendChild(pixies_suc)
	pixies_row.appendChild(pixies_inc)
	pixies_row.appendChild(pixies_lep)
	pixies_wrapper.appendChild(pixies_row)
	/////////////////
	// map wrapper 
	map_wrapper = document.createElement('div')
	map_wrapper.classList.add('map_wrapper')
	
	canvas = document.getElementById("minimap")
	canvas.classList.add('map_canvas')
	canvas.style.width = '400px'
	canvas.style.height = '400px'
	canvas.style.marginBottom = '2px'
	canvas.addEventListener("mousemove", update_tooltip,  { passive: true });
	//canvas.style.outline = '1px solid lime'
	ctx = canvas.getContext("2d");
	cgrid_size = 100


	let items_block = document.createElement('div')
	items_block.style.display        = 'flex'
	items_block.style.flexDirection  = 'row'
	items_block.style.flexWrap       = 'wrap'
	
	for (let i in item_colors) {
		item_colors_elements[i] = document.createElement('div')
		let color_icon = document.createElement('span')
		//let item_icon = document.createElement('img')
		let item_name = document.createElement('span')

		color_icon.style.display = 'inline-block'
		color_icon.style.minWidth = '10px'
		color_icon.style.minHeight = '10px'
		color_icon.style.width = '14px'
		color_icon.style.height = '14px'
		color_icon.style.marginRight = '6px'
		color_icon.style.backgroundColor = item_colors[i]
		color_icon.style.border = '1px solid navy'
		color_icon.style.boxShadow = '1px solid black'
		//color_icon.style.borderRadius = '5px'
		//item_icon.src = './data/images/blank.png'
		//item_icon.style.height = '16px'
		item_name.textContent = 'unknown'
		item_name.classList.add('item_name')
		item_colors_elements[i].style.width = '190px'
		item_colors_elements[i].style.minWidth = '190px'
		item_colors_elements[i].style.display = 'flex'
		item_colors_elements[i].style.marginBottom = '2pt'
		item_colors_elements[i].style.color = '#fff'
		item_colors_elements[i].style.fontFamily = 'Monospace'
		//item_colors_elements[i].textContent = '0'.repeat(2-i.length) + i + ' '
		item_colors_elements[i].appendChild(color_icon)
		//item_colors_elements[i].appendChild(item_icon)
		item_colors_elements[i].appendChild(item_name)
		items_block.appendChild(item_colors_elements[i])
	}

	pppointer.appendChild(x_coord)
	pppointer.appendChild(y_coord)
	pppointer.appendChild(coord_text)
	pppointer.appendChild(pppointer_direction)

	character_data.appendChild(adata)
	character_data.appendChild(bdata)
	character_data.appendChild(cdata)
	character_data.appendChild(ddata)

	plocation.appendChild(plocation_text)
	plocation.appendChild(pppointer)
	map_data.appendChild(plocation)
	
	//map_data.appendChild(dungeon_map)
	//map_data.appendChild(dungeon_legend)
	// character stats
	document.body.appendChild(character_data)
	// location info
	document.body.appendChild(map_data) 
	// pixie counter
	document.body.appendChild(pixies_wrapper) 	
	// map
	map_wrapper.appendChild(canvas)
	// map legend
	map_wrapper.appendChild(items_block)
	document.body.appendChild(map_wrapper)

	overworld_map_image = new Image(); 
	overworld_map_image.src = "./data/images/map.gif";
	

	tooltip = document.createElement('span')
	tooltip.style.padding = '5pt'
	tooltip.style.position = 'absolute'
	tooltip.textContent = 'test'
	tooltip.style.display = 'inline-block'
	tooltip.style.backgroundColor = 'rgba(0,0,0,0.5)'
	tooltip.style.outline = '1px solid white'
	tooltip.style.outlineOffsetine = '-1px'
	tooltip.style.color = 'white'

	//document.body.appendChild(tooltip) // uncomment to get coordinates tooltip (inaccurate)
	ui_initialized = true
}

prepare_ui()

let towns = { // fill in towns
	'40_13105' : true, // world + location_id
	'92_12595' : true,
	//'92_14643' : true, // true, but harmfull
	'120_12593' : true,
	'120_13361' : true,
	'232_12850' : true,
	// '232_13618' : true, // true, but harmfull
	// '232_13874' : true, // true, but harmfull
	
}

let map_ids = {
	[8] : {
		[12592] : 'Forest of Confusion',
		[12852] : 'Aborigine\'s Forest',
	},
	[16] : {
		[14131] : 'Desire Village: Blacksimth',

	},
	[20] : {
		[12854] : 'Mountain Cave 1F',
		[12598] : 'Mountain Cave 1B',
	},
	[40] : {
		[12597] : 'Desire Mine: Intro',
		[12336] : 'Desire Mine: Rodi Fight',
		[13361] : 'Desire Mine B1: altered',
		[12593] : 'Desire Mine 1F',
		[12849] : 'Desire Mine B1',
		[13105] : 'Desire Mine',
	},
	[68] : {
		[13619] : 'Enrich Town Well',
		[12595] : 'Enrich Dungeon B2',
		[13363] : 'Enrich Dungeon Well',
		[14131] : 'Enrich Dungeon F2',
		[13875] : 'Enrich Dungeon F1-2',
		[13107] : 'Enrich Dungeon: B1-2',
		[12851] : 'Enrich Dungeon: B2-2',
	},
	[92] : {
		[12595] : 'Desire Village',
		[12598] : 'Desire Village: Lisa & Basso harass Rodi',
		[12851] : 'Desire Village: Elder',
		[13363] : 'Desire Village: Shop',
		[13619] : 'Desire Village: Pub',	
		[14643] : 'Desire Village: Church Square',
		[14387] : 'Desire Village: Church',
	},
	[120] : {
		[12593] : 'Enrich Town',
		[13361] : 'Enrich Church square',
	},
	[160] : {
		[12600] : 'West Shrine',
		[13362] : 'Forest Cave B1: South Side',
		[12850] : 'Forest Cave B1: North Side',
		[13106] : 'Forest Cave B2',
	},
	[232] : {
		[13874] : "Enrich Castle Throne Room",
		[13362] : "Enrich Castle Dungeon",
		[13618] : "Enrich Castle",
		[12850] : "Enrich Castle Gate",
	},
	[244] : "World Map",

}

let eid_list = {
    [14643] : 'Desire Village: Church',
    [hex2int("0x3133")] : 'Desire Village',
    [244] : 'World Map',
    [13105] : 'Desire Mine',
    [12592] : 'Forest of Confusion',


    [hex2int("0x3330")] : 'World Map',
    [hex2int("0x3531")] : 'Desire Mine',
    
    [hex2int("0x3534")] : 'Aborigine Forest',
    [hex2int("0x3535")] : 'Aborigine Mansion',
    [hex2int("0x3536")] : 'Mountain CAve',
    [hex2int("0x3538")] : 'West Shrine',
    [hex2int("0x3539")] : 'East Shrine',
    [hex2int("0x3830")] : 'Save Menu Screen',
    [hex2int("0x3831")] : 'Title Screen',
}


let treasures =  {
    [244] : {
		name : 'world map',
		items: {
			[1.5] : {
				[-11] : {
					name: 'Desire Village',
					cursor_pos : '1.5_2.1',
				}
			},
			[12.5] : {
				[-12] : {
					name: 'Desire Mine',
					cursor_pos : '2.3_2.2',
				}
			},
			[11] : {
				[-7] : {
					name: 'Forest of Confusion',
					cursor_pos : '2.1_1.9',
				}
			},
			[17] : {
				[-16] : {
					name: 'God\'s Peak'
				}
			},
			[13.5] : {
				[-1] : {
					name: 'Forest Cave',
					//text_position : 'bottom',
					cursor_pos : '2.3_1.5',
				}
			},
			[5.5] : {
				[0.5] : {
					name: 'Enrich Town',
					text_position : 'right',
					cursor_pos : '1.6_1.4',
				}
			},
			[8] : {
				[-3] : {
					name: 'Enrich Castle'
				}
			},
			[-1] : {
				[-5.5] : {
					name: 'Border Gate',
					// text_position : 'bottom',
					cursor_pos : '1.3_1.8',
				}
			},
			[10] : {
				[9] : {
					name: 'Mountain Cave',
					cursor_pos : '1.8_1.1',
				}
			},
			[-0.5] : {
				[-0.5] : {
					name: 'Aborigine\'s Mansion',
					//text_position  :'right'
				}
			},
			[3] : {
				[1] : {
					name: 'Aborigine\'s Forest',
					text_position  :'bottom',
					cursor_pos : '1.4_1.5',
				}
			},
			[-9] : {
				[2] : {
					name: 'West Shrine',
					text_position  :'bottom',
					cursor_pos : '0.4_1.5',
				}
			},
			[18] : {
				[0] : {
					name: 'East Shrine',
					text_position  :'right',
					cursor_pos : '2.6_1.4',
				}
			},
			[12] : {
				[12] : {
					name: 'Farthest Village'
				}
			},
			[5] : {
				[15] : {
					name: 'South Shrine'
				}
			},
		}
	},
	[92] : {
		[12595] : {
			name : 'Desire Vilage',
			items : {
				[6] :{
					[0] : {
						name : 'Pub'
					},
					[2] : {
						name : 'Exit (Church)'
					},
				},
				[3] :{
					[4] : {
						name : 'Blacksmith'
					},
				},
				[-3] :{
					[0] : {
						name : 'Shop (tool, weapon, armor)'
					},
				},
				[-2] :{
					[4] : {
						name : 'Closed Door'
					},
				},
				[2] :{
					[-3] : {
						name : 'Elder\'s house'
					},
				},
				[0] :{
					[7] : {
						name : 'Exit (World Map)'
					},
				},
			},
		},
	},
	[40] : {
		[12849] : {
			name : 'Desire Mine: B1',
			display_offset : {
				x: -0.8, // abs(x_coordinate)+this = integer that's bigger than the x_coordinate
				y: 0.3   // abs(y_coordinate)-this = integer that's equal to the y_coordinate
			},
			items : {
				[13] :{
					[12] : {
						name : '40 Gold'
					}
				},
				[16] :{
					[21] : {
						name : '40 Gold'
					}
				},
				[19] :{
					[7] : {
						name : 'Healing Herb'
					}
				},
				[20] :{
					[19] : {
						name : 'Healing Herb'
					}
				},
				[30] :{
					[7] : {
						name : 'Gold 60'
					}
				},
				[25] :{
					[5] : {
						name : 'Exit (F1)'
					},
					[12] : {
						name : 'Iron Circlet'
					}
				},
				[29] : {
					[16] : {
						name: 'Exit (F1)'
					}
				},
			},
		},
		[12593] : {
			name : 'Desire Mine: 1F',
			display_offset : {
				x: -0.8, 
				y: 0.3   
			},

			items : {
				[17] : {
					[15] : {
						name: 'Leather Glove'
					}
				},
				[18] : {
					[11] : {
						name: 'Healing Herb'
					}
				},
				[25] : {
					[5] : {
						name: 'Exit (B1)'
					}
				},
				[27] : {
					[7] : {
						name: 'Muran (succubus)'
					}
				},
				[28] : {
					[16] : {
						name: 'Exit (B1)'
					}
				},
				[30] : {
					[18] : {
						name: 'Healing Herb'
					}
				},
				[31] : {
					[13] : {
						name: 'Healing Herb'
					}
				},
			},
		},
		[13105] : {
			name : 'Desire Mine',
			display_offset : {
				x: 0.0, 
				y: -0.0  
			},
			items : {
				[4] : {
					[-6] : {
						name: 'Dana (leprechaun)'
					}
				},
				[2] : {
					[-2] : {
						name: 'Exit (1F)'
					},
					[7] : {
						name: 'Exit (1F)'
					}
				},
				[6] : {
					[6] : {
						name: 'Exit (World Map)'
					}
				},

			},
		},
		[13361] : {
			name : 'Desire Mine: 1F (altered)',
			display_offset : {
				x: -0.8, 
				y: 0.3  
			},
			items : {
				[14] : {
					[15] : {
						name: 'Royal Circlet'
					}
				},
				[15] : {
					[5] : {
						name: 'Mithril Ingot'
					}
				},
				[17] : {
					[5] : {
						name: 'Potion'
					}
				},
			},
		},
	},
	[8] : {
		[12592] : {
			name : 'Forest of Confusion',
			offsets : {
			},
			items : {
				[-11] : { // x
					[11] : { // y
						name: "Lucky Cookie"
					}
				},
				[-8] : { // x
					[-2] : { // y
						name: "Angel Wing"
					}
				},
				[-7] : { // x
					[3] : { // y
						name: "Middle Shield"
					},
				},
				[-10] : { // x
					[4] : { // y
						name: "Exit (Forest Cave)"
					},
				},
				[-6] : { // x
					[7] : { // y
						name: "Maple (Pixie)"
					},
					[10] : { // y
						name: "Puppy"
					}
				},
				[-3] : { // x
					[-8] : { // y
						name: "Healing Herb"
					}
				},
				[3] : { // x
					[5] : { // y
						name: "Bronze Shell"
					}
				},
				[8] : { // x
					[4] : { // y
						name: "Healing Herb"
					}
				},
				[9] : { // x
					[-4] : { // y
						name: "Wooden Staff",
					},
					[10] : { // y
						name: "Cheerful Bread"
					},
				},
				[12] : { // x
					[-3] : { // y
						name: "Daisy (fairy)",
					},
					[11] : { // y
						name: "Angen Wing"
					},
				},
			}
		},
		[12852] : {
			name : 'Aborigine\'s Forest',
			display_offset : {
				x: 0.0, 
				y: 0.0  
			},
			items : {
				[7] : {
					[-4] : {
						name : "Angel Wing"
					},
				},
				[9] : {
					[-14] : {
						name : "Morgan (leprechaun)"
					},
					[-21] : {
						name : "Steel Sword"
					},
				},
				[2] : {
					[-8] : {
						name : "Peony (fairy)"
					},
					[-10] : {
						name : "Power Shield"
					},
				},
				[3] : {
					[-20] : {
						name : "Peony (fairy)"
					},
				},
				[14] : {
					[-19] : {
						name : "Krupis (incubus)"
					},
				},
			},
		},
	},
	[68] : {
		[14131] : {
			name : 'Enrich Dungeon F2',
			display_offset : {
				x: 0.2, 
				y: 0.3  
			},
			items : {
				[5] : {
					[9] : {
						name : 'Exit (Enrich Dungeon: B1-2)',
					},
				},
				[7] : {
					[9] : {
						name : 'Exit (Enrich Castle, one way)',
						text_position : 'bottom'
					},
				},
			},
		},
		[13875] : {
			name : 'Enrich Dungeon F1',
			display_offset : {
				x: 0.2, // abs(x_coordinate)+this = integer that's bigger than the x_coordinate
				y: 0.3   // abs(y_coordinate)-this = integer that's equal to the y_coordinate
			},
			items : {
				[5] : {
					[5] : {
						name : 'Potion',
					},
					[9] : {
						name : 'Exit (Enrich Dungeon: B1-2)',
					},
				},
				[6] : {
					[8] : {
						name : 'Mithril Ore',
					},
				},
				[8] : {
					[4] : {
						name : 'Exit (Enrich Dungeon: 2F)',
					},
				},
			},
		},
		[13363] : {
			name : 'Enrich Dungeon Well',
			display_offset : {
				x: 0.2, 
				y: 0.3  
			},
			items : {
				[8] : {
					[11] : {
						name : 'Crystal Key',
					},
					[14] : {
						name : 'Pixie Cedar',
					},
				},
				[9] : {
					[8] : {
						name : 'Exit (Enrich Dungeon)'
					},
				},
				[4.5] : {
					[6] : {
						name : 'Exit (Enrich Dungeon B2)'
					},
				},
				[5] : {
					[18] : {
						name : 'Exit (Enrich Dungeon B2)'
					},
				},
			},		
		},
		[13107] : {
			name : 'Enrich Dungeon: B1-2',
			display_offset : {
				x: 0.2, 
				y: 0.3  
			},
			items : {
				[4] : {
					[2] : {
						name : '???'
					},
					[17] : {
						name : 'Exit (Enrich Dungeon: B2-2)'
					},
				},
				[3] : {
					[15] : {
						name : 'Brave Apple'
					},
				},
				[2] : {
					[4] : {
						name : 'Life Candle'
					},
				},
				[8] : {
					[4] : {
						name : 'Exit (Enrich Dungeon: B2-?)'
					},
				},
			},
		},	
		[12851] : {
			name : 'Enrich Dungeon: B2-2',
			display_offset : {
				x: 0.2, 
				y: 0.3  
			},			
			items : {
				[8] : {
					[5] : {
						name : 'Lime (pixie)'
					},
					[25] : {
						name : 'Aster (incubus)'
					},
				},
				[0] : {
					[26] : {
						name : 'Exit (Enrich Dungeon: B2)'
					},
				},
				[4] : {
					[18] : {
						name : 'Exit (Enrich Dungeon: B1)'
					},
				},
			},
		},	
		[12595] : {
			name : 'Enrich Dungeon: B2',
			display_offset : {
				x: 0.6, 
				y: 0.2  
			},
			items : {
				[1] : {
					[14] : {
						name : 'Morgan (leprechaun)'
					},
				},
				[2] : {
					[21] : {
						name : 'Eagle Crest'
					},
				},
				[-1] : {
					[5] : {
						name : 'Exit (Enrich Dungeon Well)'
					},
				},
				[0] : {
					[23] : {
						name : 'Potion'
					},
				},
				[-3] : {
					[26] : {
						name : 'Exit (Enrich Dungeon Well)'
					},
				},
				[5] : {
					[17] : {
						name : 'Iron Brace'
					},
				},
				[4] : {
					[10] : {
						name : 'Camelia (fairy)'
					},
				},
				[12] : {
					[19] : {
						name : 'Critical Juice'
					},
					[3] : {
						name : 'Goat Crest'
					},
				},
				[17] : {
					[13] : {
						name : 'Gold Key'
					},
				},
				[21] : {
					[10] : {
						name : 'Snake Crest'
					},
				},
				
				[23] : {
					[3] : {
						name : 'Slash Dagger'
					},
				},
				
				
			},
		},
	},
	[20] : {
		[12854] : {
			name : 'Mountain Cave 1F',
			display_offset : {
				x: 0.2, 
				y: -0.3 
			},
			items : { 
				[-10] : {
					[0] : {
						name : "Life Ring"
					},
				},
				[-2] : {
					[5] : {
						name : "Lily (fairy)"
					},
				},
				[-1] : {
					[6] : {
						name : "???"
					},
				},
				[16] : {
					[10] : {
						name : "Lucky Cookie"
					},
				},
				[14] : {
					[-1] : {
						name : "Basso"
					},
				},
				[11] : {
					[-6] : {
						name : "Exit (Mountain Cave B1)"
					},
				},
				[4] : {
					[12] : {
						name : "Exit (Mountain Cave B1)"
					},
				},
				[8] : {
					[-3] : {
						name : "Exit (Mountain Cave B1)"
					},
				},
			},
		},
		[12598] : {
			name : 'Mountain Cave 1B',
			display_offset : {
				x: 0.8, 
				y: -0.3  
			},
			items : { 
				[8] : {
					[7] : {
						name : "Potion"
					},
				},
			},
		},
	},
	[160] : {
		[12600] : {			
			name : 'West Shrine',
			display_offset : {
				x: -0.8, 
				y: -0.2  
			},
			items : { 
				[-9] : {
					[3] : {
						name : "Turtle Snacks"
					},
					[5] : {
						name : "Battle Armor"
					},
				},
			},
		},
		[13362] : {
			name : 'Forest Cave B1', //9.3:22.3
			display_offset : {
				x: -0.35,
				y: -0.75  
			},
			items : { 
				[-11] : {
					[23] : {
						name : "Exit (World Map)"
					},					
				},
				[-8] : {
					[6] : {
						name : "Mithril Ore"
					},					
				},
				[-1] : {
					[-1.5] : {
						name : "Exit (Forest Cave B2)"
					},					
					[18] : {
						name : "Angel Wing"
					},					
				},
				[8] : {
					[6] : {
						name : "Antidote"
					},			
					[14] : {
						name : "Scale Suit"
					},					
				},
				[9] : {
					[21] : {
						name : "Willow (pixie)"
					},					
				},
			},
		},
		[12850] : {
			name : 'Forest Cave B1 - North Side',
			display_offset : {
				x: -0.3, 
				y: -0.8  
			},
			items : { 
				[9] : {
					[3] : {
						name : "Exit (Forest Cave B2)"
					},					
				},
				[2] : {
					[-20] : {
						name : "Exit (Forest of Confusion)"
					},					
				},
				[0] : {
					[1] : {
						name : "Bronze Staff"
					},					
				},
				[4] : {
					[0] : {
						name : "Antidote"
					},
					[-4] : {
						name : "Iris (fairy)"
					},
				},
				[-4] : {
					[-7] : {
						name : "Healing Herb"
					},					
				},
			},
		},
		[13106] : {
			name : 'Forest Cave B2',
			display_offset : {
				x: -0.8, 
				y: -0.75 
			},
			items : { 
				[-6] : {
					[27] : {
						name : "Exit (Forest Cave B1)"
					},					
				},
				[-5] : {
					[14] : {
						name : "Bronze Brace"
					},					
				},
				[-2.5] : {
					[1] : {
						name : "Exit (Forest Cave B1 - North Side)"
					},					
				},
				[-1] : {
					[9] : {
						name : "Tak (leprechaun)"
					},					
				},
				[-16] : {
					[12] : {
						name : "Healing Herb"
					},					
				},
				[-15] : {
					[20] : {
						name : "Magic Nectar"
					},					
				},
				[4] : {
					[5] : {
						name : "Feather Robe"
					},					
					[16] : {
						name : "Enjewel (incubus)"
					},					
				},
			},
		},
	},

}


let minimap = {}
let minx = Number.MAX_SAFE_INTEGER
let miny = Number.MAX_SAFE_INTEGER
let minxx = Number.MAX_SAFE_INTEGER
let maxxx = Number.MIN_SAFE_INTEGER
let minyy = Number.MAX_SAFE_INTEGER
let maxyy = Number.MIN_SAFE_INTEGER


function draw_player_pointer(d) {
	let data = d.position
	
	ctx.save()
		if (towns[d.worldmap+'_'+d.location_id]) {
			ctx.translate(cgrid_size*(1-Number(Math.round(data.x))), cgrid_size*(1+Number(Math.round(data.y))))
		} else {
			ctx.translate(cgrid_size*(1-Number(data.x)), cgrid_size*(1+Number(data.y)))
		}
		ctx.strokeStyle = 'rgb(255,55,55,1)'
		ctx.fillStyle = 'rgb(255,205,55,1)'

		ctx.save()
			ctx.translate(-cgrid_size/2, -cgrid_size/2)
			ctx.rotate((Math.PI / 180) * (360-data.direction));
			ctx.save()
				ctx.translate(-cgrid_size/2, -cgrid_size/2)
					ctx.beginPath();
						ctx.moveTo(+2, cgrid_size/2);
						ctx.lineTo(cgrid_size-2, +2)
						ctx.lineTo(cgrid_size-2, cgrid_size-2)
						ctx.moveTo(+2, cgrid_size/2);
					ctx.fill();

					ctx.beginPath();
						ctx.moveTo(+2, cgrid_size/2);
						ctx.lineTo(cgrid_size-2, +2)
						ctx.lineTo(cgrid_size-2, cgrid_size-2)
						ctx.moveTo(+2, cgrid_size/2);
						ctx.stroke();

						ctx.fillStyle = 'rgb(255,55,55,1)'
						ctx.beginPath();
						ctx.moveTo(+2, cgrid_size/2);
						ctx.lineTo(cgrid_size-2-cgrid_size/2, +2+cgrid_size/4)
						ctx.lineTo(cgrid_size-2-cgrid_size/2, cgrid_size-2-cgrid_size/4)
						ctx.moveTo(+2, cgrid_size/2);
					ctx.fill();
			ctx.restore()
		ctx.restore()
	ctx.restore()
		
}

let sine_arg = 0

function draw_minimap(d) {
	sine_arg = sine_arg + 0.2
	let sine = Math.sin(sine_arg)
	
	ctx.clearRect(0, 0, 400, 400)	
	if (!d) { return } 
	if (d.worldmap == 244) {
		ctx.save()
			ctx.rotate(-0.15)
			ctx.drawImage(overworld_map_image, 0,50, 350, 350)
		ctx.restore()		
	}
	
	let data = d
	let items = treasures[d.worldmap]?.[d.location_id]?.items
	let offsets = treasures[d.location_id]?.offsets || {}
	let display_offset = treasures[d.worldmap]?.[d.location_id]?.display_offset || {x:0, y:0}

	if (d.worldmap == 244) {
		items = treasures[244].items
		minimap = []
	} else {
		minimap = d.mapped_data
	}

	cgrid_size = 100
	ctx.save()
		ctx.translate(1, 1)
		for (let x in minimap) {
			for (let y in minimap[x]) {			
				if (Number(-x) < Number(minxx)) {
					minxx = -x
					minx = Math.abs(minxx) 
				}
				if (Number(y) < Number(minyy)) {
					minyy = y
					miny = Math.abs(minyy) 
				}
				if (Number(-x) > Number(maxxx)) {
					maxxx = -x
				}
				if (Number(y) > Number(maxyy)) {
					maxyy = y				
				}

			}
		}

		for (let x in items) {
			for (let y in items[x]) {			
				if (items[x][y]) {
					if (Number(x) < Number(minxx)) {
						minxx = x
						minx = Math.abs(minxx) 
					}
					if (Number(y) < Number(minyy)) {
						minyy = y
						miny = Math.abs(minyy) 
					}
					if (Number(x) > Number(maxxx)) {
						maxxx = x
					}
					if (Number(y) > Number(maxyy)) {
						maxyy = y				
					}
				}
			}
		}

		if (d.worldmap == 244) {
			maxxx = 20
			maxyy = 20
			minxx = -20
			minyy = -20
		}
		cgrid_size = Math.min(Math.floor(Math.min(
			360/(Math.abs(maxyy - minyy)+2), 
			360/(Math.abs(maxxx - minxx)+2))
		), 50)


		ctx.save()
			ctx.translate((-minxx+1)*cgrid_size+1, (-minyy+1)*cgrid_size+1)
			ctx.fillStyle = 'rgb(255,245,255,1)'// bg
			for (let x in minimap) {
				for (let y in minimap[x]) {			
					if (minimap[x][y]) {
						if (towns[d.worldmap+'_'+d.location_id]) {
							ctx.fillRect(-Number(cgrid_size*Math.round(x))-1, Number(cgrid_size*Math.round(y))-1, cgrid_size+2, cgrid_size+2);
						} else {
							ctx.fillRect(-Number(cgrid_size*x)-1, Number(cgrid_size*y)-1, cgrid_size+2, cgrid_size+2);
						}
					}
				}
			}

			ctx.strokeStyle = 'rgb(255,245,255,1)'// bg
			let item_color_index
			for (let x in minimap) {
				for (let y in minimap[x]) {			
					if (minimap[x][y]) {
						if (towns[d.worldmap+'_'+d.location_id]) {
							if (minimap[x][y].additional) {							
								for (let xx in minimap[x][y].additional) {
									for (let yy in minimap[x][y].additional[xx]) {
										console.log(-Number(cgrid_size*Math.round(x))-1+cgrid_size/2, Number(cgrid_size*Math.round(y))-1+cgrid_size/2, -Number(cgrid_size*Math.round(xx))-1+cgrid_size/2, Number(cgrid_size*Math.round(yy))-1+cgrid_size/2)
										ctx.lineCap = 'butt'
										if (Math.round(x)==Math.round(xx) || Math.round(y) == Math.round(yy)) {
											ctx.lineWidth = cgrid_size+2
										} else  {
											ctx.lineWidth = Math.sqrt(2*cgrid_size*cgrid_size);
										}

										ctx.beginPath();
											ctx.moveTo( 
												-Number(cgrid_size*Math.round(x))-1+cgrid_size/2, 
												Number(cgrid_size*Math.round(y))-1+cgrid_size/2
											);
											ctx.lineTo(
												-Number(cgrid_size*Math.round(xx))-1+cgrid_size/2, 
												Number(cgrid_size*Math.round(yy))-1+cgrid_size/2
											);
										ctx.stroke();
									}
								}
							}
						}
					}
				}
			}

			// fg
			for (let x in minimap) {
				for (let y in minimap[x]) {			
					if (minimap[x][y]) {
						let r = 0
						let g = 0
						let b = 0

						if (minimap[x][y].z?.up ) {
							r = 225
						}
						if (minimap[x][y].z?.down ) {							
							g = 125
						}
						if (minimap[x][y].z?.middle ) {
							b = 205
						}
						ctx.strokeStyle = 'rgb('+r+','+g+','+b+',1)'
						// if ((d.position.x == x) && (d.position.y == y)) {
						// 	console.log(ctx.fillStyle, x, y, minimap[x][y].z)
						// }
						if (towns[d.worldmap+'_'+d.location_id]) {
							if (minimap[x][y].additional) {							
								for (let xx in minimap[x][y].additional) {
									for (let yy in minimap[x][y].additional[xx]) {
										ctx.lineCap = 'butt'
										if (Math.round(x)==Math.round(xx) || Math.round(y) == Math.round(yy)) {
											ctx.lineWidth = cgrid_size
										} else  {
											ctx.lineWidth = Math.sqrt(2*cgrid_size*cgrid_size)-2;
										}

										ctx.beginPath();
											ctx.moveTo( 
													-Number(cgrid_size*Math.round(x))-1+cgrid_size/2, 
													Number(cgrid_size*Math.round(y))-1+cgrid_size/2
											);
											ctx.lineTo(
												-Number(cgrid_size*Math.round(xx))-1+cgrid_size/2, 
												Number(cgrid_size*Math.round(yy))-1+cgrid_size/2
											);
										ctx.stroke();
										ctx.lineWidth = 1;
									}
								}
							}
						}
					}
				}
			}


			for (let x in minimap) {
				for (let y in minimap[x]) {			
					if (minimap[x][y]) {
						let r = 0
						let g = 0
						let b = 0
						let z2 = minimap[x][y].z?.z2 || 0 // z2 shows ceilien height, z shows foot height
							if (minimap[x][y].z?.up ) {
								r = 225							
							}
							if (minimap[x][y].z?.down ) {							
								g = 125
								z2 = 0
							}
							if (minimap[x][y].z?.middle ) {
								b = 205
							}
						ctx.fillStyle = 'rgb('+r+','+g+','+b+',1)'
						
						if (towns[d.worldmap+'_'+d.location_id]) {
							ctx.fillRect(-Number(cgrid_size*Math.round(x))+cgrid_size*z2/200, Number(cgrid_size*Math.round(y))+cgrid_size*z2/200, cgrid_size-cgrid_size*z2/100, cgrid_size-cgrid_size*z2/100);
						} else {
							ctx.fillRect(-Number(cgrid_size*x)+cgrid_size*z2/100, Number(cgrid_size*y)+cgrid_size*z2/100, cgrid_size-cgrid_size*z2/50, cgrid_size-cgrid_size*z2/50);
						}
					}
				}
			}

			item_color_index = item_color_index = 0
			ctx.translate(Number(offsets.x || 0)*cgrid_size, Number(offsets.y || 0)*cgrid_size)
		
			for (let x in items) {
				for (let y in items[x]) {			
					if (items[x][y]) {
						ctx.save()
							ctx.translate((Number(x)+display_offset.x)*cgrid_size+1, (Number(y)+display_offset.y)*cgrid_size+1)
							ctx.fillStyle = item_colors[item_color_index]					
							ctx.fillRect(0+cgrid_size/16,0+cgrid_size/16, cgrid_size-cgrid_size/8, cgrid_size-cgrid_size/8);
							ctx.strokeStyle = 'rgb(10,10,155,1)'
							ctx.strokeRect(0+cgrid_size/16,0+cgrid_size/16, cgrid_size-cgrid_size/8, cgrid_size-cgrid_size/8);				

							ctx.strokeStyle = 'rgb(0,0,0,1)'
							let text = items[x][y].name || ""
							let real_cursor_pos = d.position.x+'_'+d.position.y
							let cursor_pos = items[x][y].cursor_pos
							let color = 'rgb(255,255,255,1)'					
							let bgcolor = 'rgb(1,1,1,1)'					
							
							if (d.worldmap == 244 || (text.indexOf('Exit') >= 0)) {
								if (real_cursor_pos == cursor_pos) {
									color = 'rgb('+ (105+150*sine) +','+ (225+25*sine) +','+ (255) +',1)'
									bgcolor = 'rgb('+ (100) +','+ (100-25*sine) +','+ (100-50*sine) +',1)'
									
								}
								let text_position = items[x][y].text_position
								ctx.font = "11px monospace";
								ctx.shadowColor = "black";
								ctx.shadowBlur = 2;
								if (d.worldmap != 244)  {
									if (y<=0) {
										text_position  = 'bottom'
									}
									if (x<=0) {
										text_position  = 'right'
									}
								}

								switch (text_position) {
									case 'right' : 
										ctx.fillStyle = bgcolor
										ctx.fillText(text, 13, 10);
										ctx.fillStyle = color
										ctx.fillText(text, 12, 9);
										break
									case 'bottom' : 
										ctx.fillStyle = bgcolor
										ctx.fillText(text, -text.length*3+1, 19);
										ctx.fillStyle = color
										ctx.fillText(text, -text.length*3, 18);
										break
									default: 
										ctx.fillStyle = bgcolor
										ctx.fillText(text, -text.length*3+1, 0);
										ctx.fillStyle = color
										ctx.fillText(text, -text.length*3, -1);
								}
							}
						ctx.restore()
						item_color_index = item_color_index +1 
					}
				}
			}

			draw_player_pointer(data)
		ctx.restore()
	ctx.restore()

}


let json_data 
let last_map_id

function show_message(message) {
	if (!ui_initialized) {
		return
	}

	try {
		json_data = JSON.parse(message.data)
	} catch(err) {
	}

	if (json_data.map_changed) {
		map_changed = true
	}

	if (json_data.worldmap == 244) {
		json_data.location_id = 244
	}

	if (map_changed) {
		false
		//console.log('map changed')
		let items = treasures[json_data.worldmap]?.[json_data.location_id]?.items		
		let item_counter = 0

		for (let x in items) {
			for (let y in items[x]) {			
				if (items[x][y]) {					
					let iname_element = item_colors_elements[item_counter].getElementsByClassName('item_name')[0]
					item_colors_elements[item_counter].style.display = 'flex'
					iname_element.textContent = items[x][y].name
					item_counter = item_counter + 1
				}
			}
		}

		for (let i=item_counter; i<20; i++) {
			item_colors_elements[i].style.display = 'none'
		}

	}

	let party_count = json_data.party_characters_list.length

	if (party_count>=1) {
		adata.classList.add("visible")
		//aname.textContent   = json_data.party_characters_list[0].charAt(0).toUpperCase() + json_data.party_characters_list[0].slice(1)
		aname.textContent   = json_data.hero_name.join("")
		ahpt.textContent     = 'HP'
		ahp.textContent     = json_data.hp[json_data.party_characters_list[0]] +'/'
		amax_hp.textContent = json_data.max_hp[json_data.party_characters_list[0]]
		ampt.textContent     = 'MP'
		amp.textContent     = json_data.mp[json_data.party_characters_list[0]] +'/'
		amax_mp.textContent = json_data.max_mp[json_data.party_characters_list[0]]

		let status = json_data.status[json_data.party_characters_list[0]]
		//console.log(status)
		if (status == 'Poisoned') {
			astatus.src = './data/images/poison.png'
		} else {
			astatus.src = ''
		}
	} else {
		adata.classList.remove("visible")
	}
	
	if (party_count>=2) {
		bdata.classList.add("visible")
		bname.textContent   = json_data.party_characters_list[1].charAt(0).toUpperCase() + json_data.party_characters_list[1].slice(1)
		bhpt.textContent     = 'HP'
		bhp.textContent     = json_data.hp[json_data.party_characters_list[1]] +'/'
		bmax_hp.textContent = json_data.max_hp[json_data.party_characters_list[1]]
		bmpt.textContent     = 'MP'
		bmp.textContent     = json_data.mp[json_data.party_characters_list[1]] +'/'
		bmax_mp.textContent = json_data.max_mp[json_data.party_characters_list[1]]

		let status = json_data.status[json_data.party_characters_list[1]]
		if (status == 'Poisoned') {
			bstatus.src = './data/images/poison.png'
		} else {
			bstatus.src = ''
		}
	} else {
		bdata.classList.remove("visible")
	}
		
	if (party_count>=3) {
		cdata.classList.add("visible")
		cname.textContent   = json_data.party_characters_list[2].charAt(0).toUpperCase() + json_data.party_characters_list[2].slice(1)
		chpt.textContent     = 'HP'
		chp.textContent     = json_data.hp[json_data.party_characters_list[2]] +'/'
		cmax_hp.textContent = json_data.max_hp[json_data.party_characters_list[2]]
		cmpt.textContent     = 'MP'
		cmp.textContent     = json_data.mp[json_data.party_characters_list[2]] +'/'
		cmax_mp.textContent = json_data.max_mp[json_data.party_characters_list[2]]


		let status = json_data.status[json_data.party_characters_list[2]]
		if (status == 'Poisoned') {
			cstatus.src = './data/images/poison.png'
		} else {
			cstatus.src = ''
		}
	} else {
		cdata.classList.remove("visible")
	}
		
	if (party_count>=4) {
		ddata.classList.add("visible")
		dname.textContent   = json_data.party_characters_list[3].charAt(0).toUpperCase() + json_data.party_characters_list[3].slice(1)
		dhpt.textContent     = 'HP'
		dhp.textContent     = json_data.hp[json_data.party_characters_list[3]] +'/'
		dmax_hp.textContent = json_data.max_hp[json_data.party_characters_list[3]]
		dmpt.textContent     = 'MP'
		dmp.textContent     = json_data.mp[json_data.party_characters_list[3]] +'/'
		dmax_mp.textContent = json_data.max_mp[json_data.party_characters_list[3]]

		let status = json_data.status[json_data.party_characters_list[3]]
		if (status == 'Poisoned') {
			dstatus.src = './data/images/poison.png'
		} else {
			dstatus.src = ''
		}
	
	} else {
		ddata.classList.remove("visible")
	}
	

	
	pppointer_direction.style.transform = 'rotate('+(360-json_data.position.direction)+'deg)'
	x_coord.textContent = Math.floor(-json_data.position.x) + ':'
	y_coord.textContent = Math.floor(json_data.position.y) + ':'+ Math.floor(json_data.position.z)
	
	plocation_text.textContent = 
	(map_ids[json_data.worldmap]?.[json_data.location_id] || map_ids[json_data.worldmap])
	+ ' '
	+ '(' + json_data.worldmap + ' : ' + json_data.location_id + ')'
	

	if (json_data.reset_cell_size) {
		cgrid_size = 30
		//console.log("resetting cell size")
		minx = Number.MAX_SAFE_INTEGER
		miny = Number.MAX_SAFE_INTEGER
		minxx = Number.MAX_SAFE_INTEGER
		maxxx = Number.MIN_SAFE_INTEGER
		minyy = Number.MAX_SAFE_INTEGER
		maxyy = Number.MIN_SAFE_INTEGER

		
	}

	pix_count = {}

	for (let species in json_data.pixies_flags) {
		//console.log(species)
		for (let pix in json_data.pixies_flags[species]) {
			let got = json_data.pixies_flags[species][pix]
			if (got  == 1) {
				pix_count[species] = (pix_count[species] || 0) + 1
			}
		}
	}

	pixies_fai_text.textContent = pix_count.pixie || 0
	pixies_pix_text.textContent = pix_count.fairy || 0
	pixies_suc_text.textContent = pix_count.succubus || 0
	pixies_inc_text.textContent = pix_count.incubus || 0
	pixies_lep_text.textContent = pix_count.leprechaunt || 0

	//console.log(json_data.pixies) // string representation of pixies data
	//console.log(json_data.pixies_flags) // named lists of pixies
}


function update_tooltip(event) {
	if (!event) {return}
	if(tooltip && json_data) {
		let rect = canvas.getBoundingClientRect();
		let cx = 8 // rect.right // no right margin past document.body, hence 0
		let cy = rect.top 
		let cpx = event.clientX - cx
		let cpy = Math.floor(event.clientY - cy)
		let cpxx = Math.floor(cpx/cgrid_size)-1
		let cpyy = Math.floor(cpy/cgrid_size)-1
		let x = event.clientX
		let y = event.clientY
		tooltip.style.left = (20)+x+'px'
		tooltip.style.top = y+'px'
		tooltip.innerHTML = Math.floor(cpxx+Number(minxx))+' : '+Math.floor(cpyy+Number(minyy)) + "<br>" + 
							  json_data.position.x+' : '+json_data.position.y + "<br>" +
							  cpxx+' : '+cpyy + "<br>" 
	}
}

setInterval(
	function() {
		draw_minimap(json_data) 
		update_tooltip()
	},
	16
)




new_client()

