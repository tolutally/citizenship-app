const fs = require('fs');
const path = require('path');

const chapters = [
  {
    number: 1,
    title: 'Rights and Responsibilities',
    rows: String.raw`
Q1	Who are regulated by laws in Canada?	individuals	governments	both A and B	none	C
Q2	Canada has an 800-year tradition of ordered liberty dating back to the signing of what?	Magna Carta	Flis	Charter of Independence	There was no signing	A
Q3	Which is NOT a source of Canadian law?	French Civil Code	Law passed by Parliament	US federal law	English common law	C
Q4	The Constitution of Canada was amended in which year?	1982	1997	1947	1980	A
Q5	The phrase recognizing the supremacy of God and the rule of law underlines the importance of what?	religious tradition	dignity and worth of the human person	both A and B	none	C
Q6	How old is Canada's tradition of ordered liberty?	1000 years	800 years	700 years	900 years	B
Q7	Habeas corpus is derived from which common law tradition?	German	English	French	Italian	B
Q8	Under the oath of citizenship, to whom do Canadians swear allegiance?	Prime Minister	Governor General	Sovereign	Premier	C
Q9	What age group must demonstrate adequate knowledge of English or French for citizenship?	12-75	14-85	18-54	16-62	C
Q10	Who is Canada's representative of the Sovereign?	The people	Sovereign	Governor General	Armed forces	C
Q11	The Constitution was amended in 1982 to entrench which charter?	Canadian Charter of Rights and Freedoms	Crime and Punishment	Citizens Responsibility	National Allegiance	A
Q12	What status does the Constitution give multiculturalism?	It should not exist	It is prohibited	It should be celebrated	It should be ignored	C
Q13	What does the Constitution say about Aboriginal peoples?	Their rights cannot be overruled by it	They are subordinate to it	They are not mentioned	They do not have equal status	A
Q14	From where do the rights and responsibilities of Canadian citizens come?	the future	History	recent wars	each government decides	B
Q15	Which religion has greater rights in Canada?	Islam	Christianity	Judaism	they are all equal	D
Q16	Mobility rights state what?	Canadians can live and work anywhere in Canada	Canadians can enter and leave the country freely	Canadians cannot live and work freely	both A and B	D
Q17	The right to vote comes with the responsibility to vote in which elections?	federal	provincial	local	all of these	D
Q18	According to the government, who is above the law?	the Queen	Prime Minister	Nobody	Governor General	C
Q19	Which set lists three responsibilities of Canadian citizens?	recycling, armed forces service, loyalty to the British Empire	fluency in English, voting, joining a union	buying Canadian, minding your own business, using less electricity	obeying the law, taking responsibility for yourself and your family, serving on a jury	D
Q20	Taking care of the environment is the responsibility of whom?	Government	Queen	Every citizen	none	C
Q21	Serving on a jury in Canada is what?	compulsory	applauded	not allowed	dangerous	A
Q22	Helping in the community and volunteering helps with what?	getting everybody involved	making friends and contacts	developing the working and social environment	all of these	D
Q23	Which is prohibited in Canada?	Making multiple properties	Having more than two children	Female genital mutilation	Service in the armed forces	C
Q24	In Canada, when is forced marriage of women permitted?	when she turns 18	when she becomes dependent	under all circumstances	under no circumstances	D
Q25	In Canadian courts, statements against women due to cultural traditions will be what?	applauded	applied	disregarded	agreed	C
Q26	What is the status of men and women under Canadian law?	they are not equal	they are equal	they are equal under some conditions	they are not equal under some conditions	B
Q27	Spousal abuse, forced marriage, honor killing, and female genital mutilation are what?	personal problems	crimes in all circumstances	crimes under some circumstances	the court does not deal with these issues	B
Q28	People unable to perform full military service in Canada may do what?	serve part-time	cannot apply	be abandoned by the government	lose their jobs	A
Q29	The safety of Canada's North is ensured by whom?	RCMP	Navy	Canadian Rangers	Police Department	C
Q30	Serving in the military and defending forces in Canada is what?	compulsory	does not exist	applauded	looked down upon	C
Q31	What is the name of the military forces in Canada?	Canadian Rangers	Canadian Forces	Canadian Army	none of these	B
Q32	Teenagers who cannot join the Canadian Army can become what?	cadet	police officer	nurse	driver	A
`
  },
  {
    number: 2,
    title: 'Who We Are',
    rows: String.raw`
Q33	Who are the founding peoples of Canada?	Aboriginal	French	British	all of these	D
Q34	Canada's institutions uphold a commitment to what?	peace, order and good government	armed forces power	good agriculture	wide population	A
Q35	Which country is often referred to as the Great Dominion?	Canada	Australia	South Korea	Germany	A
Q36	Canada is regarded around the world as what?	dependent	strong and free	aggressive	captive	B
Q37	What is the only constitutional monarchy in North America?	Canada	USA	Germany	Russia	A
Q38	The Canadian system of government is based on what?	population rule	constitutional monarchy	benign dictatorship	republican democracy	B
Q40	Territorial rights were first guaranteed through the Royal Proclamation of 1763 by whom?	King George II	St. Patrick	King George III	Acadians	C
Q41	Most Metis people live in which region?	Prairie Provinces	Northern Territories	Ontario	Quebec	A
Q42	Canadian citizens who are neither Inuit nor Metis are known as what?	First Nations	second nation	Quebecers	Ontarians	A
Q43	What does Inuit mean in the Inuktitut language?	the people	the farmers	the conquerors	the invaders	A
Q44	Until what date did the federal government force Aboriginal students to assimilate into mainstream Canadian culture?	1970	1980	1990	2000	B
Q45	Thousands of years ago, the ancestors of Aboriginal peoples migrated from where?	Africa	Asia	Korea	India	B
Q46	The Inuit live across which region?	Arctic	prairie	north	south	A
Q47	Who said immigrant groups should retain their individuality and each make its contribution to the national character?	John Buchan	St. Patrick	King George III	none of these	A
Q48	In which year did Ottawa formally apologize for its treatment of Aboriginal students?	1978	2008	1988	1958	B
Q49	How many distinct groups make up Aboriginal peoples?	2	3	4	5	B
Q50	The Metis are a distinct people of mixed Aboriginal and European ancestry from what backgrounds?	both French-speaking and English-speaking backgrounds	East Asia	Greenland	Newfoundland	A
Q51	What is Canada's greatest strength?	freedom	English and French languages	diversity	scientific inventions	C
Q52	According to John Buchan, immigrants should learn from what?	only their own traditions	other traditions	only their parents	none	B
Q53	About how many anglophones are in Canada today?	18 million	20 million	23 million	24 million	A
Q54	What percentage of Aboriginal peoples are Inuit?	4%	8%	45%	50%	A
Q55	Today Acadian culture is a lively part of what?	English-speaking Canada	French-speaking Canada	German-speaking Canada	Inuktitut-speaking Canada	B
Q56a	The majority of French-speaking Canadians belong to which province?	New Brunswick	Quebec	Yukon	Ontario	B
Q56b	What are the descendants of the French colonists who began settling the Maritime provinces in 1604 called?	Britain	Acadians	Germans	Vikings	B
Q58	What is the only officially bilingual province in Canada?	Quebec	New Brunswick	Prairie Provinces	Montreal	B
Q59	Anglophones are people who speak what as their first language?	French	English	Metis	Inuktitut	B
Q60	The deportation of more than two-thirds of the Acadians during the war between Britain and France from 1755 to 1763 is known as what?	Great Upheaval	Fallback	Great Deportation	great movement	A
Q61	Who began settling the Maritime provinces in 1604?	Acadians	Vikings	Aboriginals	Inuit	A
Q62	In what year did the House of Commons recognize that the Quebecois form a nation within a united Canada?	2000	2002	2004	2006	D
Q63	About how many people speak French as their first language in Canada?	5 million	7 million	8 million	10 million	B
Q64	Francophones are people who speak what as their first language?	French	English	Metis	Inuktitut	A
Q65	Canada is also known as what?	land of immigrants	house of culture	cloud of diversity	none	A
Q66	In becoming Canadian, newcomers are expected to embrace what?	Canadian law	international law	their native land's law	no law	A
Q67	After English, what is the second most spoken non-official language at home in Canada?	Chinese	Japanese	Hindi	German	A
Q68	Does every person in Canada have the freedom to live according to their religion?	Yes	No	depends on religion	depends on population	A
Q69	Since 1970, immigrants have been most likely to come from where?	Africa	Asia	Korea	Antarctica	B
Q70	Gay and lesbian marriage under Canadian law is what?	not allowed	allowed	allowed in some circumstances	none	B
Q71	The great majority of Canadians identify as what?	Atheists	Muslims	Hindus	Christians	D
Q72	Compared to heterosexuals, what rights does Canada give gay and lesbian couples?	not equal	equal	equal under some circumstances	none	B
`
  },
  {
    number: 3,
    title: "Canada's History",
    rows: String.raw`
Q73	Who was the commander of the British army who died leading troops at the Battle of the Plains of Abraham in 1759?	Brigadier James Wolfe	Marquis de Montcalm	King Charles II	Fort Garry	A
Q74	A large number of Aboriginals died because of what?	European diseases toward which they lacked immunity	harsh climate	war between Vikings and French	none	A
Q75	Which nomadic peoples moved following the bison herds?	Inuit	Cree and Dene	French	Sioux	D
Q76	Europeans found all regions occupied by native people they called what?	Chinese	Vikings	Indians	Greenlanders	C
Q77	Who first drew a map of Canada's east coast?	King Francis I of France	John Cabot	Count Frontenac	Sir Guy Carleton	B
Q78	Who were the first Europeans to visit Canada?	Vikings	Indians	French	Germans	A
Q79	Europeans called natives Indians because the first explorers thought they had reached what?	West Indies	North Indies	East Indies	South Indies	C
Q80	What is the name of the remains of the Viking settlement found in Newfoundland?	L'Anse aux Meadows	Plains of Abraham	Winnipeg	none	A
Q81	Jacques Cartier heard guides speak an Iroquoian word meaning what?	home	land	village	Canada	C
Q82	Since when has the name Canada appeared on maps?	1650	1550	1750	1850	B
Q83	The French Empire in North America reached from Hudson Bay south to where?	Gulf of Mexico	USA	Korea	Boston	A
Q84	In 1608, Champlain built a fortress at which city?	Vancouver	Whitehorse	Quebec City	Montreal	C
Q85	In what year did the Iroquois and the French make peace?	1700	1701	1600	1601	B
Q86	What was the major trade between the French and Aboriginal peoples?	oil	fur	wheat	coal	B
Q87	The first European settlement north of Florida was established in which year?	1607	1604	1650	1670	B
Q88	The first European settlement north of Florida was established by which French explorers?	Pierre de Mons	Jacques Cartier	Samuel de Champlain	both A and C	D
Q89	In 1670, the Hudson's Bay Company competed with which traders?	Montreal-based traders	Vancouver-based traders	New Brunswick-based traders	Quebec-based traders	A
Q90	Who granted the Hudson's Bay Company exclusive trading rights in 1670?	King Charles I	King Charles II	Queen Elizabeth II	Queen Victoria	B
Q91	In which battle did the British defeat the French at Quebec City?	Battle of the Plains of Abraham	James Bay	Boer War	First World War	A
Q92	The French-speaking Catholic people who preserved their way of life were known as what?	Canadians	habitants	both A and B	none	C
Q93	After the Battle of the Plains of Abraham, the British renamed the colony what?	Ontario	Prairie Province	Province of Quebec	New Brunswick	C
Q94	What did the Quebec Act of 1774 restore?	French civil law	British criminal law	both A and B	equality law	C
Q95	What benefits did the Quebec Act of 1774 give Catholics?	religious freedom	rule the British Empire	hold public office	both A and C	D
Q96	The Quebec Act of 1774 was meant to govern which majority?	English Catholic majority	French Roman Catholic majority	immigrants	non-official language speakers	B
Q97	The more than 40,000 people loyal to the Crown who fled the American Revolution were called what?	traitors	Loyalists	independents	enemies	B
Q98	In 1792, Black Nova Scotians moved to establish what settlement?	Sierra Leone	Montreal	Vancouver	Boston	A
Q99	In 1776, 13 British colonies declared independence and formed what country?	United States	South America	England	Independent Territory	A
Q100	Joseph Brant led thousands of Loyalist Mohawk what into Canada?	Germans	Indians	Koreans	Australians	B
Q101	Which Constitutional Act divided Quebec into Upper and Lower Canada?	1719	1790	1791	1780	C
Q102	In 1608, Champlain built a fortress at which city?	Vancouver	Whitehorse	Quebec City	Montreal	C
Q103	The Constitutional Act was passed by the British Parliament in which year?	1791	1781	1771	1761	A
Q104	The Atlantic colonies and Upper and Lower Canada were collectively called what?	British Canada	British North America	Greater Canada	Northern States	B
Q105	The first representative assembly in Canada was elected in 1758 in which colony?	PEI	New Brunswick	Nova Scotia	Newfoundland	C
Q106	In which year did the name Canada become official?	1791	1781	1771	1761	A
Q107a	Who founded the city of York, now Toronto?	Governor John Graves Simcoe	Mary Ann Shadd Cary	Laura Secord	HMS Shannon	A
Q107b	Which province first moved toward the abolition of slavery in 1793?	Lower Canada	Upper Canada (Ontario)	Newfoundland	United States	B
Q109	In what year was slavery abolished throughout the British Empire?	1700	1793	1807	1833	D
Q110	Slaves escaped to Canada by means of what?	pipeline	Underground Railroad	sewage	tunnels	B
Q111	Canada's first financial institutions opened in which period?	late 17th and early 18th centuries	late 16th and early 17th centuries	late 18th and early 19th centuries	late 19th and early 20th centuries	C
Q112a	For centuries, Canada's economy was based mainly on what?	oil	weapons	natural resources such as fur, timber and fish	slavery	C
Q112b	When did the United States launch the invasion that led to the War of 1812?	1832	1812	1870	1807	B
Q113	Who was the first member of the Canadian Corps not born in the British Empire to receive the Victoria Cross?	Abel Seaman William Hall	Corporal Philip Konowal	Lt. Alexander Robert Dunn	Captain Paul Triquet	B
Q114	Victoria Day is celebrated on which day?	Wednesday preceding June 25	Tuesday preceding May 25	Monday preceding May 25	Thursday preceding July 25	C
Q115	The first companies in Canada were formed during what era?	French and German	French and British	German and British	none	B
Q116	Cities such as Edmonton, Langley, and Victoria started as what?	landing stages	army bases	trading posts	religious settlements	C
Q117	The Montreal Stock Exchange opened in which year?	1834	1832	1877	1807	B
Q118	The first companies in Canada competed for which trade?	fur	oil	fish	weapons	A
Q119	At Chateauguay, how many Americans did Lt. Col. Charles de Salaberry turn back?	4000	5000	6000	7000	A
Q120	What was the purpose of the War of 1812 from Canada's perspective?	to conquer the USA	to ensure Canada remained independent of the USA	political issues	natural resources	B
Q121	Where did the Americans burn the Government House and Parliament buildings in 1813?	New Brunswick	Ontario	Quebec	York	D
Q123	Which nation helped Canada against America in the War of 1812?	British	German	Japan	India	A
Q124	According to Lord Durham, Canadians should assimilate into which culture?	English-speaking	French-speaking	German-speaking	British	A
Q125	Lord Durham recommended that Upper and Lower Canada be merged and given what?	responsible government	separate government	natural resources	rebellion force	A
Q126	Armed rebellion in the area outside Montreal and Toronto occurred in what years?	1807-08	1817-18	1837-38	1877-78	C
Q127	Who became the first head of responsible government in Canada?	Sir Louis-Hippolyte LaFontaine	Sir Etienne Cartier	Sir Pascal Tache	Lt. James FitzGibbon	A
Q128	In 1840, Upper and Lower Canada were united as what?	Province of Canada	Province of Germany	Province of the United States	Province of Korea	A
Q129	Which was the first British North American colony to attain full responsible government in 1847-48?	Newfoundland	Nova Scotia	Greenland	Vancouver	B
Q131	Ontario and Quebec together with New Brunswick and Nova Scotia formed what in 1867?	Dominion of Canada	Florida	Germany	none	A
Q132	July 1 is officially celebrated as what?	Canada Day	Freedom Day	Independence Day	Constitutional Day	A
Q133	When did Nunavut become part of Canada?	1995	1996	1998	1999	D
Q134	The men who worked to establish the new country from 1864 to 1867 are called what?	Fathers of Canada	Fathers of Confederation	Fathers of Dominion	none	B
Q135	Which act did the British Parliament pass in 1867?	Constitutional Act	British North America Act	both A and B	none	B
Q136	What system of government did the Fathers of Confederation create?	federal	provincial	both A and B	none	C
Q137	When did Sir Leonard Tilley suggest the name Dominion of Canada?	1864	1791	1867	1862	A
Q138	Sir Leonard Tilley was inspired by which Psalm?	84	96	72	60	C
Q139	Who was the first Prime Minister of Canada?	Sir Etienne Cartier	Sir John Alexander Macdonald	Sir Sam Steele	Fort Garry	B
Q140	Parliament recognized January 11 as what?	Dominion Day	Independence Day	Sir John Alexander Macdonald Day	Canada Day	C
Q141	Sir John A. Macdonald was born in Scotland on what date?	February 11, 1850	January 21, 1815	January 11, 1815	December 21, 1850	C
Q142	Whose portrait appears on the 10-dollar bill?	Sir John A. Macdonald	Sir Etienne Cartier	Sir Sam Steele	Beaver	A
Q143	Who led Quebec into Confederation and helped negotiate the entry of the Northwest Territories, Manitoba and British Columbia?	Sir George-Etienne Cartier	Macdonald	Sir Sam Steele	Fort Garry	A
Q144	When did Canada take over the Northwest from the Hudson's Bay Company?	1879	1869	1859	1849	B
Q145	In what year did Prime Minister Macdonald establish the North West Mounted Police?	1873	1893	1883	1882	A
Q146	Louis Riel is known as what?	defender of Metis rights	father of Manitoba	father of Confederation	both A and B	D
Q147	The RCMP is considered what?	municipal force	national police force	international police force	armed force	B
Q148	When Canada took over the Northwest in 1869, which group was not consulted?	Sioux	Iroquois	Metis	Indians	C
Q149	Which province joined Canada in 1871 after the railway promise?	Germany	British Columbia	Greenland	none	B
Q150	The railway project was financed by which countries?	Britain	Germany	America	both A and C	D
Q151	In what year did the Government of Canada apologize for the discriminatory policy against Chinese immigrants, including the head tax?	2008	2006	2004	2002	B
Q152	How many immigrants were welcomed during the economic boom before the First World War?	1 million	2 million	3 million	4 million	B
Q153	Who was the first French Canadian Prime Minister since Confederation?	Macdonald	Fort Gary Horse	Sir Wilfrid Laurier	Agnes McPhail	C
Q154	Most immigrants before the First World War came from where?	Ukraine	India	Antarctica	France	A
Q155	The Canadian Corps captured Vimy Ridge in which month and year?	December 1917	April 1917	January 1920	April 1920	B
Q156	The South African War of 1899-1902 is also known as what?	First World War	Vimy War	Boer War	Battle of the Plains of Abraham	C
Q157	How many soldiers sacrificed their lives in the First World War?	30000	40000	50000	60000	D
Q158	Ottawa interned more than 8000 former Austro-Hungarian subjects, mainly which group?	Ukrainian men	German men	American men	French men	A
Q159	How many Canadians served in the First World War out of a population of 8 million?	400000	500000	600000	700000	C
Q160	Who was the first woman to practice medicine in Canada?	Sir Robert Borden	Agnes McPhail	Dr. Emily Stowe	Therese Casgrain	C
Q161	In which year were most women citizens aged 21 and over granted the right to vote in federal elections?	1971	1918	1920	1947	B
Q162	In 1921, who became the first woman member of Parliament?	Agnes McPhail	Dr. Emily Stowe	Queen Elizabeth II	none	A
Q163	The nurses who served in the Royal Canadian Army Medical Corps were known as what?	Red Birds	Bluebirds	Purple Birds	Dirds	B
Q164	The effort by women to achieve the right to vote is known as what?	women's suffrage movement	Women Voting Action	Women Right to Vote	Women Power	A
Q165	Women were granted the right to vote in provincial elections in Quebec in what year?	1950	1940	1840	1850	B
Q166	Which province first gave women the right to vote?	Manitoba	New Brunswick	British Columbia	Quebec	A
Q167	Farmers in Western Canada were hit hardest by drought in which decade?	1940s	1930s	1920s	1910s	B
Q168	Canada and other former countries of the British Empire are part of what?	Commonwealth of Nations	Colonial Society	British Protectorate	United Nations	A
Q169	Who composed the poem In Flanders Fields?	Fort Gary	Macdonald	Colonel John McCrae	Phil Edwards	C
Q170	What were the outcomes of the Dirty Thirties?	unemployment	bad crops	businesses wiped out	all of these	D
Q171	What does the Remembrance Day poppy symbolize?	remembering the Queen	celebrating Confederation	remembering political leaders	remembering the sacrifices of Canadians who served or died in wars	D
Q172	On what date do Canadians remember veterans?	October 12	December 13	November 11	August 14	C
Q173	The Bank of Canada was established in what year?	1935	1936	1933	1934	D
Q174	Canadians took part in the liberation of which country in 1943-44?	Germany	India	Italy	South Korea	C
Q175	What was D-Day?	an Allied invasion of Normandy on June 6, 1944	the end of the Second World War	an invasion in July 1955	the birth of Macdonald	A
Q176	Approximately what fraction of Allied troops on D-Day were Canadian?	10%	20%	30%	40%	A
Q177	Canadian troops captured which beach on D-Day?	Boston	Juno Beach	Newfoundland	Hudson's Bay	B
Q178	How many Newfoundlanders served in the Second World War?	1 million	2 million	3 million	4 million	A
Q179	In 1941, Canada suffered in the unsuccessful defense of which place from the Japanese?	Moscow	Boston	Hong Kong	Vancouver	C
Q180	How many Canadian soldiers were killed in the Second World War?	54000	34000	44000	64000	C
Q181	By the end of the Second World War, Canada's navy was what?	wiped out	third largest navy in the world	no ships left	none	B
Q182	The Royal Canadian Navy's finest hour occurred in which battle?	Battle of the Pacific	Battle of the Atlantic	Battle of the South	Battle of the North	B
Q183	The Second World War began in which year?	1940	1941	1939	1938	C
`
  },
  {
    number: 4,
    title: 'Modern Canada',
    rows: String.raw`
Q184	The Canada Pension Plan and Quebec Pension Plan were introduced in what year?	1915	1935	1965	1995	C
Q185	By what year did more than half of Canadians have adequate food, shelter and clothing?	1931	1941	1951	1961	C
Q186	What ensures common elements of health care across Canada?	Canada Health Act	Constitutional Act 1970	Canada Medicine Act	Canada Pent Act	A
Q187	What began Canada's modern energy industry?	discovery of oil in Alberta in 1947	end of the Second World War	freedom	US aid	A
Q188	Provincial and territorial governments provide funds for what?	public education	weapons	armed forces	trading	A
Q189	Federal unemployment insurance was introduced in what year?	1940	1960	1980	1990	A
Q190	How many Canadian soldiers died in the Korean War?	300	400	500	600	C
Q191	After the Second World War, Canada took part in which UN mission?	peacekeeping	violence	trading	invasion	A
Q192	Canada joined democratic Western countries to form what alliance?	NATO	North Pacific Treaty Organization	South Atlantic Treaty Organization	South Pacific Treaty Organization	A
Q193	Canadian troops fought in the Korean War during which years?	1950-1953	1940-1943	1960-1963	1930-1933	A
Q194	The last referendum defeat for Quebec sovereignty occurred in what year?	1980	1985	1990	1995	D
Q195	What did the Official Languages Act of 1969 do?	give rights to non-official languages	guarantee federal government services in French and English	ban non-official languages	make Japanese and Hindi equal to French and English	B
Q196	The rapid change in Quebec during the 1960s is called what?	slow revolution	Quiet Revolution	tremendous revolution	rapid revolution	B
Q197	In what year was La Francophonie founded?	1920	1940	1970	1990	C
Q198	Japanese Canadians got the right to vote in what year?	1950	1945	1948	1940	C
Q199	The 37,000 people who escaped Soviet tyranny in 1956 and were welcomed by Canada were from which country?	Hungary	Ukraine	Germany	Greenland	A
Q200	Aboriginal peoples were granted the right to vote in what year?	1970	1960	1950	1940	B
Q201	By the 1960s, what fraction of Canadians had origins that were neither British nor French?	one quarter	one third	one half	three quarters	B
Q202	Canada welcomed 50,000 refugees from which country in 1976?	Ethiopia	Greenland	Africa	Vietnam	D
Q203	A better-educated population created what opportunity for women?	entering professional workforces	gaining the right to vote	getting education	joining the armed forces	A
Q204	Which are Canadian musicians?	Sir Ernest MacMillan	Healey Willan	both A and B	Michael	C
Q205	Who is a famous Canadian writer?	Pauline Johnson	Terry Fox	Wayne Gretzky	none	A
Q206	Wayne Gretzky played for which team from 1979 to 1988?	Montreal Canadiens	Edmonton Oilers	Ottawa Senators	Toronto Maple Leafs	B
Q207	CFL teams compete for which trophy?	Gray Cup	White Cup	Black Cup	Red Cup	A
Q208	Who were the pioneers of modern abstract art in Quebec in the 1950s?	Les Automatistes	Les Realistes	Les Abstractionists	Les Cubists	A
Q209	Who was the world record sprinter and double Olympic gold medalist in 1996?	Chantal Petitclerc	Donovan Bailey	Mark Tewksbury	Paul Henderson	B
Q210	Who is the world champion wheelchair racer and Paralympic gold medalist?	Donovan Bailey	Terry Fox	Wayne Gretzky	Chantal Petitclerc	D
Q211	Who began the cross-country Marathon of Hope to raise money for cancer research?	Donovan Bailey	Terry Fox	Wayne Gretzky	Chantal Petitclerc	B
Q212	Who invented basketball?	James Naismith	Mark Tewksbury	Paul Henderson	Donovan Bailey	A
Q213	Herzberg, Polanyi, Altman, Taylor, Smith and Brockhouse were what?	musicians	writers	scientists	politicians	C
Q214	What is Canada's best-known contribution to the visual arts?	Group of 11	Group of Seven	Group of Eight	Group of Nine	B
Q215	Who invented the Canadarm?	Alexander Graham Bell	Matthew Evans	Mike Lazaridis	SPAR Aerospace	D
Q216	Who invented the worldwide system of standard time zones?	Alexander Graham Bell	Matthew Evans	Mike Lazaridis	Sir Sanford Fleming	D
Q217	Who discovered insulin?	Sir Frederick Banting	Dr. John A. Hopps	Alexander Graham Bell	Sir Sanford Fleming	A
Q218	Which wireless communication company became known for the Blackberry?	smartphones	Huawei phones	iPhone	BlackBerry	D
Q219	Who invented the first cardiac pacemaker?	Dr. Wilfred Penfield	Dr. John A. Hopps	Alexander Graham Bell	Sir Sanford Fleming	B
Q220	Which is NOT a Canadian invention?	insulin	Canadarm	electric light bulb	BlackBerry	C
`
  },
  {
    number: 5,
    title: 'How Canadians Govern Themselves',
    rows: String.raw`
Q221	The federal government is responsible for what?	agriculture	national and international concerns	civil rights	immigration	B
Q222	Health care is whose responsibility?	provincial government	federal government	legislative assemblies	Sovereign	A
Q223	What is the minimum voting age in Canada?	16	17	18	19	C
Q224	Provinces are governed by what?	arbitrary law	federal government	legislative assemblies	Sovereign	C
Q225	Which act defines the responsibilities of the federal and provincial governments?	British North America Act	Constitutional Act 1867	both A and B	Constitutional Act 1997	C
Q226	Where does the federal government sit?	Montreal	Quebec City	Toronto	Ottawa	D
Q227	Which key facts describe Canada's system of government?	federal state	parliamentary democracy	constitutional monarchy	all of these	D
Q228	Who grants royal assent to a bill on behalf of the Sovereign?	Governor General	Prime Minister	Members of Parliament	Senator	A
Q229	Which part of Parliament has members appointed by the Governor General who serve until age 75?	House of Commons	House of Lords	Governor's House	Senate	D
Q230	How are members of the House of Commons selected?	appointed by the UN	appointed by the Sovereign	appointed by landowners or police	elected by voters in local constituencies	D
Q231	What are the parts of Parliament?	Sovereign	Senate	House of Commons	all of these	D
Q232	Cabinet ministers must resign if they are defeated in what kind of vote?	non-confidence vote	successful non-confidence vote	confidence vote	successful confidence vote	A
Q233	How often must elections for the House of Commons be held?	every 5 years	every 3 years	every 4 years	every 6 years	C
Q234	How many times must a bill be read in the House of Commons?	once	twice	three times	none	C
Q235	To become law, a bill must do what?	pass the House of Commons	receive royal assent	pass the Senate	all of these	D
Q236	Who represents the Sovereign in the provincial legislatures?	Lieutenant governors	Prime Minister	MPs	Members of the House of Commons	A
Q237	Who selects cabinet ministers in the federal government?	Prime Minister	Governor	Sovereign	Senators	A
Q238	Which is NOT part of Parliament?	Senate	Lieutenant governors	House of Commons	Sovereign	B
Q239	In a parliamentary democracy, representatives are responsible for what?	passing laws	approving and monitoring expenditures	keeping the government accountable	all of these	D
Q240	A proposed law in Parliament is called what?	proposal	inbox	theory	bill	D
Q241	Senators are appointed by whom?	Canadian citizens	Sovereign	House of Commons	Governor General	D
Q242	Who is the head of government in Canada?	Prime Minister	Governor	Sovereign	none	A
Q243	Who is the head of state in Canada?	Prime Minister	Governor	Sovereign	none	C
Q244	The Governor General is appointed by whom?	Sovereign on the advice of the Prime Minister	cabinet on the advice of the Sovereign	Canadian citizens	House of Commons	A
Q245	As head of the Commonwealth, the Sovereign links Canada to how many nations?	10	23	46	53	D
Q246	The Governor General is usually appointed for how many years?	1	5	10	15	B
Q247	What office has a similar role to the Governor General in each province?	Lieutenant Governor	Premier	Senate member	MP	A
Q248	The Sovereign is represented in Canada by whom?	Prime Minister	Governor General	cabinet minister	none	B
Q249	Who has no political role in Canadian democracy?	Sovereign	Prime Minister	Governors	Senate members	A
Q250	In each province, who performs a role similar to the Prime Minister?	Governor	Premier	Senate member	none	B
Q251	Who represents the Sovereign in each of the 10 provinces for five years?	Governor General	Prime Minister	Lieutenant Governor	MPs	C
Q252	Who leads the governments of the provinces?	Governor Generals	Premiers	Lieutenant Governors	Queen	B
Q253	No bill becomes law until it passes both chambers and receives what?	royal assent	Prime Minister	public voting	NOCC	A
`
  },
  {
    number: 6,
    title: 'Federal Elections',
    rows: String.raw`
Q254	How many members of the House of Commons are elected?	100	200	207	308	D
Q255	Who represents every electoral district in the House of Commons?	MP	Governor	Prime Minister	none	A
Q256	In a federal election, Canadians vote for whom?	Senate member	Prime Minister	Governors	Members of the House of Commons	D
Q257	An electoral district is a geographical area represented by whom?	MP	Governor	Prime Minister	none	A
Q258	Canada is divided into how many electoral districts?	300	305	350	308	D
Q259	At what age can a Canadian run in a federal election?	20 or older	19 or older	18 or older	17 or older	C
Q260	How many people can run from a single district?	24	12	6	as many as qualify	D
Q261	How many districts are there in Canada?	208	308	408	508	B
Q262	Federal elections must be held on which schedule?	first Monday in October every 3 years	second Monday in August every 4 years	third Monday in October every 4 years	fifth Monday in September every 5 years	C
Q263	Voting details are passed to citizens through what?	social media	mail	phone calls	citizens must find out on their own	B
Q264	How can you vote if you cannot vote on election day?	online	advance polls or special ballot	you cannot vote	you decide on your own	B
Q265	Can a Canadian citizen be added to the voters list on election day?	yes	no	depends	none	A
Q266	Voters lists are produced by whom?	Elections Canada	Legislative Assembly	Federal Government	Sovereign	A
Q267	What is the paper you vote on called?	voters list	voter information card	writing	ballot	D
Q268	What does secret ballot mean?	a kind of game	no one can watch you vote and no one knows how you voted	confidential government information	none	B
Q269	After an election, the Governor General asks which party to form the government?	the party with fewer seats	the party with more seats	a random party	the Queen suggests a party	B
Q270	The three major political parties in the House of Commons listed here are Conservative, NDP and which other party?	Workers Party	Liberal Party	Officers Party	Feminist Party	B
Q271	If the majority vote against a major government decision, the party in power is what?	successful	defeated	promoted	none	B
Q272	If a party holds at least half the seats, what is it called?	minority government	majority government	neutral government	none	B
Q273	The Prime Minister and cabinet ministers together are called what?	Senate	Cabinet	ruler	table	B
Q274	Who governs provincial government departments?	MP	Senators	Cabinet ministers	Lieutenant governors	C
Q275	Who runs federal government departments?	Prime Minister	cabinet ministers	Governor General	none	B
Q276	What mark do you make on a ballot?	O	Y	X	exclamation mark	C
Q277	The government ensures your vote remains what?	closed	not registered	secret	none	C
Q278	What confirms your name on the voters list and tells you when and where to vote?	email	phone call	voter information card	social media	C
Q279	Which is a responsibility of the federal government?	national defence	education	social health	agriculture	A
Q280	Which is a responsibility of municipal government?	foreign policy	agriculture	health care	social and community health	D
Q281	Municipal laws affecting only the local community are called what?	national law	international law	bylaw	local law	C
Q282	A municipal council usually includes councillors or aldermen and whom else?	mayor	Prime Minister	Governor General	MP	A
`
  },
  {
    number: 7,
    title: 'Canadian Symbols',
    rows: String.raw`
Q295	The Crown has been a symbol of the state in Canada for over how many years?	300	400	450	600	B
Q296	Canada has been a constitutional monarchy since Confederation in 1867 during whose reign?	Queen Elizabeth II	Queen Victoria	Queen Elizabeth I	King Charles II	B
Q297	Who became Queen of Canada in 1952 and celebrated a Golden Jubilee in 2002 and Diamond Jubilee in 2012?	Queen Elizabeth III	Queen Elizabeth II	Queen Elizabeth I	Queen Victoria	B
Q298	The red and white pattern of the Canadian flag is derived from which institution's colours?	Royal Financial College Kingston	Royal Nursing College Toronto	Royal Military College Kingston	Royal Medical Campaign	C
Q299	Which colours have been the national colours of Canada since 1921?	blue and red	white and purple	red and white	red and black	C
Q300	What is Canada's official royal flag?	Union Jack	Union Queen	Union King	Union Law	A
Q301	The Royal Military College in Kingston was founded in what year?	1865	1876	1885	1897	B
Q302	The new Canadian flag was first raised in what year?	1965	1955	1950	1930	A
Q303	The Canadian Red Ensign served as Canada's flag for about how many years?	200	100	50	10	B
Q304	The maple leaf has appeared on Canadian military uniforms since the what?	1950s	1850s	1750s	1650s	B
Q305	What is Canada's best-known symbol?	pear leaf	kale leaf	maple leaf	guava leaf	C
Q306	Maple leaves were first adopted as a symbol by French Canadians in the what?	1400s	1500s	1600s	1700s	D
Q307	Which symbol was included in the Canadian Red Ensign at Confederation?	beaver	maple leaf	fleur-de-lis	crown	C
Q308	What does fleur-de-lis mean in French?	maple leaf	lily flower	beaver	crown	B
Q309	The lily flower was adopted by the French king in what year?	500	495	496	596	C
Q310	Quebec adopted its own flag based on the cross and fleur-de-lis in what year?	1948	1950	1958	1960	A
Q311	The lily flower has been a symbol of French royalty for about how many years?	500	1000	1500	2000	B
Q312	What does the Latin motto A mari usque ad mare mean?	from river to river	from region to region	from sea to sea	from country to country	C
Q313	Canada adopted its official coat of arms and national motto after which war?	First World War	Second World War	third world war	Boer War	A
Q314	The Canadian arms contain symbols of England, France, Scotland and which other country?	Germany	Korea	Ireland	Australia	C
Q315	Which building was completed in the 1860s?	Parliament buildings	Peace Tower	Eiffel Tower	Clock Tower	A
Q316	The Memorial Chamber contains books of remembrance with the names of whom?	soldiers who died in war	soldiers who served	commanders	prime ministers	A
Q317	The Quebec National Assembly is built in which style?	French First Empire	French Second Empire	French Third Empire	German and Indian	B
Q318	The Peace Tower was completed in what year?	1920	1927	1930	1937	B
Q319	What is the only original part remaining in the Canadian Parliament after the 1916 fire?	entrance	central lounge	library	basement	C
Q320	The Memorial Chamber of the Peace Tower contains what?	books of science	books of history	books of remembrance	books of economics	C
Q321	The Peace Tower was built in memory of which war?	Battle of the Plains of Abraham	Second World War	First World War	Boer War	C
Q322	Ice hockey was developed in Canada in which century?	1700s	1800s	1900s	2000s	B
Q323	What is Canada's national winter sport?	cricket	badminton	hockey	football	C
Q324	What is the second most popular sport in Canada?	basketball	football	cricket	lacrosse	B
Q325	Lacrosse was first played by whom?	Germans	French	Aboriginal peoples	Indians	C
Q326	Which sport has the most registered players in Canada?	cricket	golf	basketball	soccer	D
Q327	The Stanley Cup was donated by whom?	Adrienne Clarkson	Lord Stanley	Fort Garry	Sir Alexander Macdonald	B
Q328	Which sport was introduced by Scottish pioneers?	lacrosse	basketball	football	curling	D
Q329	What is Canada's official summer sport?	football	lacrosse	hockey	cricket	B
Q340	What is Canada's most popular spectator sport?	cricket	badminton	football	hockey	D
Q341	The Clarkson Cup is awarded for what?	men's hockey	women's hockey	both	neither	B
Q342	What was adopted centuries ago as a symbol of the Hudson's Bay Company?	lion	eagle	bison	beaver	D
Q343	Which symbol appears on the 5-cent coin?	maple leaf	polar bears	deer	beaver	D
Q344	The beaver became the emblem of the St. Jean Baptiste Society in what year?	1834	1824	1814	1804	A
Q345	Which symbol appears on the coats of arms of Montreal and Toronto?	fleur-de-lis	maple leaf	beaver	crown	C
Q346	Where was O Canada first sung?	Ontario	Newfoundland	Quebec City	Vancouver	C
Q347	English and French have equal status where?	everywhere	only in Parliament	only in specific regions	only in Ontario	A
Q348	O Canada was proclaimed the national anthem in what year?	1960	1970	1980	1990	C
Q349	What is the royal anthem of Canada?	God Bless the Queen	God Save the Queen	God Defend the Queen	God Protect the Queen	B
Q350	How do French and English Canadians sing the national anthem?	with the same words	in the words of their own language	they do not sing it	none	B
Q351	Anglophones and francophones have lived together in Canada for more than how many years?	200	300	400	500	B
Q352	Parliament passed the Official Languages Act in what year?	1959	1969	1979	1989	B
Q353	What age range of citizenship applicants must have adequate knowledge of English or French?	16-70	18-54	19-50	15-60	B
Q354	Canada started the Order of Canada honor system in what year?	1937	1987	1967	1997	C
Q355	Before the Order of Canada, Canada used which honor system?	German	Indian	British	Australian	C
Q356	Who can nominate a Canadian for an honor?	any Canadian	Parliament	Prime Minister	Queen	A
Q357	Who was the first Canadian to be awarded the Victoria Cross?	Abel Seaman William Hall	Corporal Philip Konowal	Lt. Alexander Robert Dunn	Captain Paul Triquet	C
Q358	Who was the last Canadian to be awarded the Victoria Cross?	Abel Seaman William Hall	Corporal Philip Konowal	Captain Paul Triquet	Lt. Robert Hampton Gray	D
Q359	The Victoria Cross is awarded for what?	scientific research	conspicuous bravery	civil service	military service	B
Q360	What is the highest honour available to Canadians?	Nobel Prize	Victoria Cross	Lieutenant Shield	none	B
Q361	How many people have been awarded the Victoria Cross since 1854?	67	85	71	96	D
Q362	Who was the first Black man to receive the Victoria Cross?	Abel Seaman William Hall	Corporal Philip Konowal	Lt. Alexander Robert Dunn	Captain Paul Triquet	A
`
  },
  {
    number: 8,
    title: 'National Public Holidays',
    rows: String.raw`
Q363	Good Friday is celebrated on what day?	Friday preceding Easter Sunday	Friday preceding Easter Monday	Tuesday preceding Easter	Wednesday preceding Easter	A
Q364	Boxing Day is observed on what date?	November 11	November 20	December 25	December 26	D
Q365	Vimy Day is observed on what date?	April 9	May 29	June 30	March 30	A
Q366	Christmas Day is observed on what date?	November 11	November 20	December 25	December 26	C
Q367	Canada Day is celebrated on what date?	June 1	July 1	August 1	September 1	B
Q368	The feast of St. Jean Baptiste is celebrated on what date?	August 24	June 24	July 24	September 24	B
Q369	Labour Day is celebrated on which day?	second Monday in October	first Monday in September	third Tuesday in December	first Friday in November	B
Q370	Sir Wilfrid Laurier Day is observed on what date?	November 11	November 20	December 25	December 26	B
Q371	Remembrance Day is observed on what date?	November 11	November 20	December 25	December 26	A
`
  },
  {
    number: 9,
    title: "Canada's Economy",
    rows: String.raw`
Q372	Canada's economy is among the world's how many largest?	top 3	top 5	top 8	top 10	D
Q373	Canada enacted free trade with the United States in what year?	1968	1988	1998	2018	B
Q374	Canada's economy mostly depends on what?	tourism	finance	service	trading	D
Q375	Which country became Canada's NAFTA partner in 1994?	Germany	Japan	Mexico	China	C
Q376	Who is Canada's largest trading partner?	Mexico	United States	Australia	Greenland	B
Q377	What phrase describes the border between Canada and the United States?	the world's longest undefended border	Intercanada and America	intercity defense	Canadian highway	A
Q378	What proportion of Canadian workers are employed in service industries?	25%	50%	75%	85%	C
Q379	How much of Canada's exports go to the United States?	one quarter	three quarters	half	less than a quarter	B
Q380	Canada's major exports are mainly what?	natural resources	manufacturing	automobiles	all of these	A
Q382	How many distinct regions does Canada have?	2	3	4	5	D
`
  },
  {
    number: 10,
    title: "Canada's Regions",
    rows: String.raw`
Q383	Which ocean lies to the west of Canada?	Pacific	Atlantic	Arctic	none	A
Q384	Canada is the what largest country in the world?	first	second	third	fourth	B
Q385	Along the southern edge of Canada lies what?	Arctic Ocean	Atlantic Ocean	Canada-US boundary	Greenland	C
Q386	How many oceans surround Canada?	2	3	4	5	B
Q387	Which region is in the east of Canada?	Prairie Provinces	Atlantic Provinces	Central Canada	Yukon	B
Q388	Who chose Ottawa as the capital in 1857?	Queen Elizabeth I	Queen Elizabeth II	Queen Victoria	King Charles II	C
Q389	The area surrounding Ottawa is known as what?	National Capital Region	National Canadian Region	National Territorial Region	National Queens Region	A
Q390	Ottawa was chosen as the capital in what year?	1857	1875	1845	1834	A
Q391	What is the capital of Canada?	Ontario	Ottawa	Quebec City	none	B
Q392	Ottawa is Canada's what largest metropolitan area?	first	second	third	fourth	D
Q393	How many territories are there in Canada?	2	3	4	5	B
Q394	How many provinces are there in Canada?	5	10	15	20	B
Q395	Canada's population is approximately what?	20 million	24 million	30 million	34 million	D
Q396	Anne of Green Gables is set in Prince Edward Island and features which named character?	Anne	Lucy	Matilda	Lyanna	A
Q397	Which is the most populous Atlantic province?	New Brunswick	Prince Edward Island	Nova Scotia	Newfoundland and Labrador	C
Q398	New Brunswick is situated on which mountains?	Appalachian	K2	Yukon	Rocky	A
Q399	Which is the smallest province in the Atlantic region?	Newfoundland and Labrador	Prince Edward Island	Alberta	Yukon	B
Q400	Which province is the most easterly point in North America with its own time zone?	Newfoundland and Labrador	New Brunswick	Yukon	Alberta	A
Q401	Which province is known as the gateway to Canada?	Newfoundland and Labrador	Prince Edward Island	Nova Scotia	New Brunswick	C
Q402	Which is the only officially bilingual province, with about one-third French-speaking population?	Newfoundland and Labrador	Prince Edward Island	Nova Scotia	New Brunswick	D
Q403	What is the largest city in New Brunswick?	Saint John	Victoria	Halifax	Aylmer	A
Q404	The St. John River, the second largest river system on the Atlantic coast of North America, is in which province?	Newfoundland and Labrador	Prince Edward Island	Nova Scotia	New Brunswick	D
Q405	The Atlantic region contains Newfoundland and Labrador, New Brunswick, Prince Edward Island, and which other province?	Ontario	Yukon	Alberta	Nova Scotia	D
Q406	Which province is home to Canada's largest naval base?	Newfoundland and Labrador	Prince Edward Island	Nova Scotia	New Brunswick	C
Q407	Which province hosts more than 700 annual festivals including the Military Tattoo?	Nova Scotia	New Brunswick	Newfoundland and Labrador	Prince Edward Island	A
Q408	What fraction of New Brunswick's population lives and works in French?	one half	one third	one sixth	one fifth	B
Q409	How many provinces are in the Atlantic region?	4	3	5	6	A
Q410	Newfoundland was the oldest colony of which empire?	German	British	French	none	B
Q411	Prince Edward Island is known for its beaches, red soil and especially what crop?	oil	potatoes	marbles	coal	B
Q412	How many provinces are in Central Canada?	2	3	4	5	A
Q413	What is the largest city in Canada by population?	Winnipeg	Toronto	Regina	Victoria	B
Q414	What is Canada's second largest city and the world's second largest French-speaking city after Paris?	Saint John	Winnipeg	Victoria	Montreal	D
Q415a	How many Great Lakes are there between Ontario and the United States?	4	5	6	7	B
Q415b	Ontario contains about what percentage of Canadians?	one quarter	one third	one half	three quarters	B
Q417	Which province is Canada's largest producer of hydroelectricity?	Quebec	Ontario	Manitoba	Victoria	A
Q418	What is the largest freshwater lake in the world?	Lake Erie	Lake Ontario	Lake Superior	Lake McKenzie	C
Q419	What fraction of Canadians live near the Great Lakes and the St. Lawrence River?	one third	one half	one quarter	one fifth	B
Q420	About how many people live in Quebec?	7 million	8 million	9 million	10 million	B
Q421	Which province produces most of Canada's oil and gas?	Quebec	Alberta	Yukon	Newfoundland and Labrador	B
Q422	Alberta has five national parks, including Banff, established in what year?	1885	1890	1895	1900	A
Q423	Which province has the largest Aboriginal population?	New Brunswick	Montreal	Manitoba	Ontario	C
Q424	Saskatchewan has what percentage of Canada's arable land?	30%	40%	50%	60%	B
Q425	The Prairie provinces contain most of Canada's what?	fertile farmlands	oil reserves	coal reserves	freshwater lakes	A
Q426	Where is the RCMP training academy located?	Saskatchewan	Victoria	Regina	Montreal	C
Q427	What is the capital of Alberta?	Saint John	Charlottetown	Edmonton	Edmonton	D
Q428	What city is the headquarters of the mining industry and an educational and technology center?	Regina	Saskatoon	Toronto	Montreal	B
Q429	Which city is a tourist center and the headquarters of the Navy's Pacific Fleet?	Montreal	Victoria	New Brunswick	Winnipeg	B
Q430	British Columbia's population is about what?	5 million	4 million	3 million	2 million	B
Q431	About half of the goods produced in British Columbia are what?	natural resources	automobiles	forestry products	oil	C
Q432	What is the capital of British Columbia?	Winnipeg	Quebec City	Victoria	Yellowknife	C
Q433	British Columbia has about how many provincial parks?	900	800	600	700	C
Q434	Which port is called the gateway to the Asia-Pacific?	Port of Vancouver	Port of Quebec	Port of Montreal	Port of New Brunswick	A
Q435	Canada's highest mountain, Mount Logan, is located in which territory?	Mackenzie	Yukon	Boer	Lawrence	B
Q436	What is the second largest river system in North America?	Mackenzie River	St. John River	Mississippi	none	A
Q437	The Northwest Territories, Nunavut and Yukon contain what fraction of Canada's land mass?	one half	one third	one quarter	one fifth	B
Q438	What is the diamond capital of North America?	Quebec City	Montreal	Yellowknife	Victoria	C
Q439	Which region has long cold winters and short cool summers?	Atlantic	Central Canada	West Coast	Northern Territories	D
Q440	What is the capital of Yukon?	Yellow Moon	White Knife	Whitehorse	Yellow Horse	C
Q441	The three northern territories together have a population of about how many people?	100000	200000	300000	400000	A
Q442	Nunavut was established from the eastern part of the Northwest Territories in what year?	1999	1995	1991	1986	A
Q443	Miners came to Yukon during the gold rush of the what?	1860s	1890s	1990s	1910s	B
Q444	Canada's North is often referred to as what?	Atlantic	land of the midnight sun	Central Canada	West Coast	B
Q445	Which territory is 85% Inuit and uses Inuktitut as an official language and the first language in school?	Yukon	Northwest Territories	Alberta	Nunavut	D
Q446	What animal is a symbol of Canada's North?	beaver	porcupine	caribou	camel	C
Q447	Which force is part of the Canadian Forces Reserve militia?	Canadian police	Canadian Rangers	Canadian doctors	Canadian Army	B
Q448	How do Rangers often travel in winter?	motorbike	heated engine cars	snowmobiles	none	C
`
  },
  {
    number: 11,
    title: 'Federal Questions',
    rows: String.raw`
Q449	An MP spending the weekend in their electoral district means they are where?	in their office on Parliament Hill	visiting the province of Quebec	in the part of the country where they were elected	vacationing	C
Q450	After a federal election, which party forms the government?	the party with the most elected representatives invited by the Governor General	the Queen picks	Governor General proposes a law	premiers pick	A
Q451	What principle of Canadian law allows a new immigrant woman to take a job on the same basis as a man?	equality of women and men	equality of all races	equal pay for equal work	equal rights	A
Q452	The name Canada comes from what?	Inuit word for country	French word for joining	Metis word for rivers	Kanata, a Huron-Iroquoian word for village	D
Q453	Where do English and French have equal status?	schools	workplace	Parliament of Canada	city hall	C
Q454	What is the first line of Canada's national anthem?	O Canada, our home and native land	Our province and native land	From far and wide	We stand on guard for thee	A
Q455	How is the government formed after an election?	the party with the most representatives forms government and the Queen chooses the PM	the party with the most representatives forms government and its leader becomes Prime Minister	the Governor General picks	each province elects one representative and the Queen chooses the PM	B
Q456	Are you allowed to question the police about their service or conduct?	no	yes, but only service and not conduct	yes, but only conduct and not service	yes, if you feel the need to	D
Q457	Which industry employs most Canadians?	natural resources	tourism	service	manufacturing	C
Q458	In which region do more than half of Canadians live?	Central Canada	Prairies	Atlantic Canada	Northern Canada	A
Q459	Which set correctly lists the major federal political parties and leaders named in the transcript?	Conservative Poilievre, NDP Singh, Liberal Trudeau, Bloc Blanchet, Green Kutner	Conservative Poilievre, Green May, Liberal Trudeau, Bloc Duceppe	NDP Singh, Green May, Liberal Ray, Bloc Pi	Liberal Trudeau, Conservative PyV, NDP Singh, Green May	A
Q460	What are the five regions of Canada?	Midwest, North, South, East, Central	Maritimes, Ontario, Quebec, Prairies, BC	Atlantic, Central, Prairie, West Coast, North	West, Central, East, Prairies, Territories	C
Q461	Which set lists three additional rights in the Charter?	freedom of speech, right to own land, fair trial	mobility rights, multiculturalism, Aboriginal rights	right to ski, moving rights, public assembly	right to vote, speak publicly, security	B
Q462	Which are two fundamental freedoms in the Charter?	freedom of conscience and religion and freedom of association	equality rights and heritage	basic freedoms and obeying laws	Aboriginal rights and volunteering	A
Q463	Which two key documents contain rights and freedoms in Canada?	Constitution and English common law	Civil Code of France and Constitution	Canadian Charter of Rights and Freedoms and Magna Carta	laws passed by Parliament and English common law	C
Q464	Which are two responsibilities of the federal government?	national defence and firefighting	national defence and foreign policy	citizenship and highways	recycling and education	B
Q465	Which are two responsibilities of provincial and territorial governments?	citizenship and foreign policy	health and education	defence and currency	criminal law and interprovincial trade	B
Q466	Which are examples of taking responsibility for yourself and your family?	buying a house and a TV	getting a job, caring for your family and working hard	doing laundry	studying for a vacation	B
Q467	Which are the Prairie provinces and their capitals?	Alberta-Edmonton and Saskatchewan-Regina	Alberta-Edmonton, Saskatchewan-Regina, Manitoba-Winnipeg	Saskatchewan-Regina and Manitoba-Winnipeg	Saskatchewan, Manitoba and Ontario	B
Q468	Which are the northern territories of Canada and their capitals?	Alaska-Juno and Yukon-Whitehorse	Northwest Territories-Yellowknife and Alaska-Juno	Northwest Territories-Yellowknife	Yukon-Whitehorse, Northwest Territories-Yellowknife, Nunavut-Iqaluit	D
Q469	What are the three levels of government in Canada?	federal, provincial or territorial, and municipal or local	federal, provincial, city	federal, territorial, provincial	federal, state, local	A
Q470	What are the two official languages of Canada?	English and Metis	Inuktitut and French	English and French	English and Inuktitut	C
Q471	The Canadian Pacific Railway symbolized what?	easy access to the west coast	what can be achieved by working together	unity	ribbons of steel	C
Q472	What did the Fathers of Confederation do?	worked together to establish the Dominion of Canada	explored and surveyed the North	formed a republican state	tried to unite Canada to the USA	A
Q473	What does the Canadian flag look like?	red and white with provincial emblems	red and white with a beaver	white with a red border on each end and a red maple leaf in the centre	red with a white maple leaf	C
Q474	Canada's system of government is called what?	dictatorship	parliamentary government	military rule	communism	B
Q475	What was the head tax?	a race-based entry fee for Chinese immigrants entering Canada	a fee for anyone entering after 1900	a tax on beer since 1867	a fee for moving westward	A
Q476	What is the largest religious affiliation in Canada?	Catholic	Muslim	Jewish	Hindu	A
Q477	Who is the Governor General named in the transcript?	David Johnston	Mary Simon	Richard Wagner	Julie Payette	B
Q478	Who is the Prime Minister and what party do they lead, according to the transcript?	Justin Trudeau, Liberal Party	Stephen Harper, Conservative Party	Thomas Mulcair, NDP	Christy Clark, Liberal Party	A
Q479	What is the role of opposition parties?	assist the Prime Minister	sign bills	oppose or try to improve government proposals	put forward bills	C
Q480	What percentage of Aboriginal people are First Nations?	30%	6%	50%	65%	D
Q481	If you do not receive a voter information card, what should you do?	go to the police	call your MP	assume you cannot vote	contact Elections Canada or visit its website	D
Q482	What is the voting procedure on election day?	go, tell officials who you are, mark X, give ballot back	go, remove ballot, mark X, deposit it	go with voter card, highlight choice, deposit it	go with voter card and ID, mark X, fold ballot, present it to officials, then deposit it	D
Q483	Where do most French-speaking Canadians live?	Ontario	Nova Scotia	Quebec	Prince Edward Island	C
Q484	Which act granted the first legislative assemblies elected by the people?	Constitutional Act 1867	Constitutional Act 1791	Constitutional Act 1982	Constitutional Act 2010	B
Q485	Which country borders Canada to the south?	United States	Central America	Mexico	Washington	A
Q486	Which federal political party is in power according to the transcript?	Green	NDP	Liberal	Conservative	C
Q487	Which statement about residential schools is NOT true?	the federal government placed Aboriginal children in residential schools	the schools were poorly funded and caused hardship	the schools were welcomed by Aboriginal people	Aboriginal language and culture were largely prohibited	C
Q488	Which party is the official opposition at the federal level according to the transcript?	NDP	Liberal	Independent	Conservative	D
Q489	Which region covers more than one-third of Canada?	Central Canada	Prairies	Atlantic Canada	Northern Territories	D
Q490	What is the industrial and manufacturing heartland of Canada?	Atlantic provinces	Prairie provinces	Central Canada	West Coast	C
Q491	Which region is known for fertile agricultural land and energy resources?	British Columbia	Prairie Provinces	Ontario	Manitoba	B
Q492	Which was the last province to join Canada?	Newfoundland and Labrador	Alberta	Saskatchewan	British Columbia	A
Q493	Who are the Quebecers?	European settlers from the 1600s	descendants of French colonists	descendants of anglophones	people of Quebec	D
Q494	Who played an important part in building the Canadian Pacific Railway?	American railroad engineers	Acadian railroad workers	Chinese railroad workers	African-American slaves	C
Q495	Who has major responsibilities on First Nations reserves?	band chiefs and councillors	municipal governments	provincial or territorial governments	federal government	A
Q496	Who was General Sir Arthur Currie?	a military leader of the Metis in the 19th century	a great frontier hero	an explorer of Western Canada	Canada's greatest soldier in the First World War	D
Q497	Who is identified as the leader of the federal Official Opposition Party in the transcript?	Candace Bergen	Andrew Scheer	Erin O'Toole	Pierre Poilievre	D
Q498	Who led an armed uprising and seized Fort Garry?	Macdonald	Louis Riel	Sam Steele	George-Etienne Cartier	B
Q499	Who led Quebec into Confederation?	Sir Louis-Hippolyte LaFontaine	Sir George-Etienne Cartier	Sir Wilfrid Laurier	Sir John A. Macdonald	B
Q500	Who was Sir Sam Steele?	a great frontier hero, mounted policeman and soldier of the Queen	a military leader of the Metis	first Prime Minister	father of Manitoba	A
Q501	Who were the Voyageurs?	Montreal-based traders travelling by canoe	immigrants in the 18th century	explorers searching for the Northwest Passage	geographers who charted British Columbia's coastline	A
Q502	Why is trade important to Canada?	it enhances the standard of living	it makes travel easier	it strengthens the economy and raises the standard of living	it brings cheaper goods	C
`
  }
];

function parseRows(raw, chapterId) {
  return raw
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('\t');
      if (parts.length !== 7) {
        throw new Error(`Invalid row for chapter ${chapterId}: ${line}`);
      }
      return {
        chapterId,
        transcriptLabel: parts[0],
        questionText: parts[1],
        options: {
          A: parts[2],
          B: parts[3],
          C: parts[4],
          D: parts[5]
        },
        correctAnswer: parts[6]
      };
    });
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

const allQuestions = chapters.flatMap((chapter, index) => parseRows(chapter.rows, index + 1));

const chapterSql = chapters
  .map((chapter, index) => `(${index + 1}, ${chapter.number}, ${sqlString(chapter.title)})`)
  .join(',\n  ');

const questionSql = allQuestions
  .map((question, index) => {
    const questionId = index + 1;
    const explanation = question.options[question.correctAnswer];
    return `(${questionId}, ${question.chapterId}, ${questionId}, ${sqlString(question.transcriptLabel)}, ${sqlString(question.questionText)}, ${sqlString(question.correctAnswer)}, ${sqlString(explanation)})`;
  })
  .join(',\n  ');

let optionId = 1;
const optionSql = allQuestions
  .flatMap((question, index) => {
    const questionId = index + 1;
    return ['A', 'B', 'C', 'D'].map((label) => {
      const row = `(${optionId}, ${questionId}, ${sqlString(label)}, ${sqlString(question.options[label])})`;
      optionId += 1;
      return row;
    });
  })
  .join(',\n  ');

const output = `-- Generated from the extracted transcript question set.
-- Note: the source transcript has numbering anomalies (duplicates and gaps),
-- so question_number is a clean sequential number while transcript_label preserves source labeling.

begin;

drop table if exists public.options;
drop table if exists public.questions;
drop table if exists public.chapters;

create table public.chapters (
  id bigint generated by default as identity primary key,
  number integer not null unique,
  title text not null
);

create table public.questions (
  id bigint generated by default as identity primary key,
  chapter_id bigint not null references public.chapters(id) on delete cascade,
  question_number integer not null unique,
  transcript_label text not null,
  question_text text not null,
  correct_answer char(1) not null check (correct_answer in ('A', 'B', 'C', 'D')),
  explanation text not null
);

create table public.options (
  id bigint generated by default as identity primary key,
  question_id bigint not null references public.questions(id) on delete cascade,
  label char(1) not null check (label in ('A', 'B', 'C', 'D')),
  option_text text not null,
  unique (question_id, label)
);

create index questions_chapter_id_idx on public.questions (chapter_id);
create index options_question_id_idx on public.options (question_id);

alter table public.chapters enable row level security;
alter table public.questions enable row level security;
alter table public.options enable row level security;

create policy \"public_can_read_chapters\" on public.chapters for select using (true);
create policy \"public_can_read_questions\" on public.questions for select using (true);
create policy \"public_can_read_options\" on public.options for select using (true);

insert into public.chapters (id, number, title)
values
  ${chapterSql};

insert into public.questions (
  id,
  chapter_id,
  question_number,
  transcript_label,
  question_text,
  correct_answer,
  explanation
)
values
  ${questionSql};

insert into public.options (id, question_id, label, option_text)
values
  ${optionSql};

select setval(pg_get_serial_sequence('public.chapters', 'id'), coalesce((select max(id) from public.chapters), 1), true);
select setval(pg_get_serial_sequence('public.questions', 'id'), coalesce((select max(id) from public.questions), 1), true);
select setval(pg_get_serial_sequence('public.options', 'id'), coalesce((select max(id) from public.options), 1), true);

commit;
`;

const outputPath = path.join(process.cwd(), 'supabase', 'seed.sql');
fs.writeFileSync(outputPath, output);
console.log(`Wrote ${allQuestions.length} questions and ${optionId - 1} options to ${outputPath}`);
