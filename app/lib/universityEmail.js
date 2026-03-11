// Academic TLD suffixes — covers most of the world
const ACADEMIC_TLDS = [
  // Generic
  '.edu',
  // UK & Ireland
  '.ac.uk', '.ac.ie',
  // Australia & NZ
  '.edu.au', '.ac.nz',
  // Africa
  '.ac.za', '.edu.ng', '.edu.gh', '.ac.ke', '.ac.tz', '.ac.ug', '.ac.rw',
  '.edu.et', '.ac.zm', '.ac.zw', '.edu.ly', '.edu.eg', '.ac.ma',
  // Asia
  '.ac.jp', '.edu.cn', '.edu.hk', '.edu.sg', '.edu.my', '.edu.ph',
  '.edu.vn', '.edu.tw', '.edu.pk', '.ac.in', '.edu.in', '.edu.bd',
  '.edu.lk', '.edu.np', '.edu.kh', '.edu.mm', '.edu.mn',
  // Middle East
  '.ac.il', '.edu.tr', '.edu.sa', '.edu.ae', '.edu.jo', '.edu.lb',
  '.edu.iq', '.edu.ir', '.edu.kw', '.edu.om', '.edu.qa', '.edu.bh',
  '.edu.ye',
  // Europe (countries that use academic subdomains)
  '.edu.pl', '.edu.sk', '.edu.ro', '.edu.rs', '.edu.hr', '.edu.ba',
  '.edu.mk', '.edu.al', '.edu.me', '.edu.gr', '.edu.pt', '.edu.es',
  '.ac.cy', '.ac.at',
  // Americas
  '.edu.br', '.edu.mx', '.edu.ar', '.edu.co', '.edu.pe', '.edu.cl',
  '.edu.ve', '.edu.ec', '.edu.bo', '.edu.py', '.edu.uy', '.edu.gt',
  '.edu.hn', '.edu.sv', '.edu.ni', '.edu.cr', '.edu.pa', '.edu.cu',
  '.edu.do', '.edu.pr', '.edu.tt', '.edu.jm',
  // Canada (most use .ca but some use edu subdomains)
  '.edu.ca',
  // Pacific
  '.ac.fj', '.edu.ws', '.ac.pg',
]

// Whitelist for countries where universities use the national TLD directly
// (Germany, France, Netherlands, Belgium, Switzerland, Scandinavia, Italy etc)
// These are well-known university domains — not exhaustive but covers major institutions
const UNIVERSITY_DOMAIN_WHITELIST = [
  // Germany
  'uni-muenchen.de', 'tum.de', 'fu-berlin.de', 'hu-berlin.de', 'tu-berlin.de',
  'uni-heidelberg.de', 'uni-frankfurt.de', 'uni-koeln.de', 'uni-hamburg.de',
  'uni-bonn.de', 'uni-freiburg.de', 'uni-tuebingen.de', 'uni-mainz.de',
  'uni-goettingen.de', 'uni-muenster.de', 'uni-erlangen.de', 'uni-stuttgart.de',
  'kit.edu', 'rwth-aachen.de', 'tu-darmstadt.de', 'tu-dresden.de',
  'uni-kiel.de', 'uni-jena.de', 'uni-halle.de', 'uni-leipzig.de',
  'uni-bremen.de', 'uni-hannover.de', 'uni-bielefeld.de', 'uni-bochum.de',
  'uni-duisburg-essen.de', 'uni-duesseldorf.de', 'uni-saarland.de',
  'uni-augsburg.de', 'uni-regensburg.de', 'uni-passau.de', 'uni-bayreuth.de',
  'uni-wuerzburg.de', 'uni-bamberg.de', 'uni-konstanz.de', 'uni-ulm.de',
  'uni-mannheim.de', 'uni-kassel.de', 'uni-marburg.de', 'uni-giessen.de',
  'uni-siegen.de', 'uni-paderborn.de', 'uni-osnabrueck.de', 'uni-oldenburg.de',
  'uni-rostock.de', 'uni-greifswald.de', 'uni-potsdam.de', 'tu-braunschweig.de',
  'tu-clausthal.de', 'tu-kaiserslautern.de', 'tu-ilmenau.de', 'tu-freiberg.de',
  'hhu.de', 'rub.de', 'ovgu.de', 'uni-due.de',
  // France
  'sorbonne.fr', 'sorbonne-universite.fr', 'paris-saclay.fr', 'u-psud.fr',
  'polytechnique.edu', 'ens.fr', 'ens-lyon.fr', 'ens-paris-saclay.fr',
  'centralesupelec.fr', 'mines-paristech.fr', 'telecom-paris.fr',
  'univ-paris-diderot.fr', 'univ-paris1.fr', 'univ-paris2.fr',
  'univ-paris3.fr', 'univ-paris5.fr', 'univ-paris8.fr', 'univ-paris13.fr',
  'univ-lyon1.fr', 'univ-lyon2.fr', 'univ-lyon3.fr', 'univ-bordeaux.fr',
  'univ-toulouse3.fr', 'univ-lille.fr', 'univ-strasbourg.fr',
  'univ-nantes.fr', 'univ-rennes1.fr', 'univ-grenoble-alpes.fr',
  'univ-amu.fr', 'univ-nice.fr', 'univ-lorraine.fr', 'unistra.fr',
  'u-bordeaux.fr', 'utc.fr', 'insa-lyon.fr', 'insa-toulouse.fr',
  'ec-lyon.fr', 'ec-nantes.fr', 'imt-atlantique.fr',
  // Netherlands
  'tudelft.nl', 'tue.nl', 'utwente.nl', 'ru.nl', 'uva.nl', 'vu.nl',
  'rug.nl', 'uu.nl', 'leidenuniv.nl', 'tilburguniversity.edu',
  'maastrichtuniversity.nl', 'wur.nl', 'erasmusuniversity.nl', 'eur.nl',
  // Belgium
  'kuleuven.be', 'ugent.be', 'vub.be', 'uliege.be', 'uclouvain.be',
  'ulb.ac.be', 'unamur.be', 'umons.ac.be', 'uantwerpen.be',
  'uhasselt.be', 'uslb.be',
  // Switzerland
  'ethz.ch', 'epfl.ch', 'unibas.ch', 'unibe.ch', 'unisg.ch',
  'uzh.ch', 'unifr.ch', 'unige.ch', 'unil.ch', 'unilu.ch',
  'usi.ch', 'bfh.ch', 'hes-so.ch', 'zhaw.ch', 'fhnw.ch',
  // Sweden
  'kth.se', 'chalmers.se', 'umu.se', 'su.se', 'liu.se', 'lu.se',
  'uu.se', 'gu.se', 'ki.se', 'slu.se', 'ltu.se', 'hhs.se',
  'mau.se', 'oru.se', 'hv.se', 'miun.se', 'hig.se',
  // Norway
  'uio.no', 'ntnu.no', 'uib.no', 'uit.no', 'nmbu.no', 'oslomet.no',
  'bi.no', 'uis.no', 'uia.no', 'hvl.no', 'inn.no',
  // Denmark
  'ku.dk', 'dtu.dk', 'au.dk', 'sdu.dk', 'ruc.dk', 'cbs.dk',
  'aau.dk', 'itu.dk', 'eas.dk',
  // Finland
  'helsinki.fi', 'aalto.fi', 'tuni.fi', 'oulu.fi', 'utu.fi',
  'jyu.fi', 'uef.fi', 'lut.fi', 'hanken.fi', 'uwasa.fi',
  // Austria
  'univie.ac.at', 'tuwien.ac.at', 'wu.ac.at', 'meduniwien.ac.at',
  'jku.at', 'uni-graz.at', 'tugraz.at', 'uni-salzburg.at',
  'uni-klu.ac.at', 'boku.ac.at', 'fhwn.ac.at',
  // Italy
  'uniroma1.it', 'uniroma2.it', 'uniroma3.it', 'unibo.it', 'polimi.it',
  'polito.it', 'unipi.it', 'unifi.it', 'unipd.it', 'unina.it',
  'unito.it', 'unibs.it', 'unibg.it', 'unicatt.it', 'luiss.it',
  'uniud.it', 'units.it', 'unitn.it', 'univr.it', 'unipa.it',
  'unical.it', 'unict.it', 'unisa.it', 'unige.it', 'unipr.it',
  'unimc.it', 'unimore.it', 'univaq.it', 'uniabr.it', 'uniurb.it',
  // Spain
  'uam.es', 'ucm.es', 'upm.es', 'upc.edu', 'upv.es', 'uv.es',
  'ub.edu', 'uab.cat', 'upf.edu', 'usc.es', 'udc.es', 'uvigo.es',
  'unav.es', 'usal.es', 'uva.es', 'uclm.es', 'unizar.es', 'unican.es',
  'uca.es', 'uco.es', 'ujaen.es', 'uma.es', 'ugr.es', 'upo.es',
  'us.es', 'uniovi.es', 'unileon.es', 'ubu.es', 'uib.es',
  'uex.es', 'unirioja.es', 'uhu.es', 'ulpgc.es',
  // Portugal
  'ulisboa.pt', 'up.pt', 'uc.pt', 'um.pt', 'ua.pt', 'ubi.pt',
  'utl.pt', 'uevora.pt', 'ualg.pt', 'ipb.pt', 'ipp.pt',
  // Poland
  'uw.edu.pl', 'agh.edu.pl', 'pwr.edu.pl', 'pg.edu.pl', 'put.edu.pl',
  'pw.edu.pl', 'uj.edu.pl', 'amu.edu.pl', 'uni.wroc.pl', 'us.edu.pl',
  'umk.pl', 'umed.pl', 'utp.edu.pl', 'ur.edu.pl', 'uph.edu.pl',
  // Czech Republic
  'cuni.cz', 'cvut.cz', 'vut.cz', 'vsb.cz', 'upol.cz', 'muni.cz',
  'zcu.cz', 'tul.cz', 'ujep.cz', 'osu.cz', 'slu.cz',
  // Hungary
  'elte.hu', 'bme.hu', 'u-szeged.hu', 'unideb.hu', 'uni-miskolc.hu',
  'uni-pannon.hu', 'ppke.hu', 'semmelweis.hu', 'uni-nke.hu',
  // Russia
  'msu.ru', 'spbu.ru', 'hse.ru', 'mipt.ru', 'bmstu.ru', 'misis.ru',
  'mgimo.ru', 'mai.ru', 'mephi.ru', 'itmo.ru', 'urfu.ru', 'nsu.ru',
  'tsu.ru', 'kfu.ru', 'sfu-kras.ru', 'dvfu.ru',
  // Japan (in addition to .ac.jp some use .u-tokyo.ac.jp style)
  'u-tokyo.ac.jp', 'kyoto-u.ac.jp', 'osaka-u.ac.jp', 'tohoku.ac.jp',
  'nagoya-u.ac.jp', 'kyushu-u.ac.jp', 'hokkaido.ac.jp', 'kobe-u.ac.jp',
  'waseda.jp', 'keio.jp', 'titech.ac.jp', 'hit.ac.jp',
  // South Korea
  'snu.ac.kr', 'kaist.ac.kr', 'postech.ac.kr', 'yonsei.ac.kr',
  'korea.ac.kr', 'skku.edu', 'hanyang.ac.kr', 'sogang.ac.kr',
  'sungkyunkwan.ac.kr', 'inha.ac.kr', 'ajou.ac.kr', 'khu.ac.kr',
  // China (in addition to .edu.cn)
  'pku.edu.cn', 'tsinghua.edu.cn', 'fudan.edu.cn', 'sjtu.edu.cn',
  'zju.edu.cn', 'nju.edu.cn', 'ustc.edu.cn', 'hit.edu.cn',
  'tongji.edu.cn', 'bjtu.edu.cn', 'bit.edu.cn', 'buaa.edu.cn',
  // India (in addition to .ac.in / .edu.in)
  'iitb.ac.in', 'iitd.ac.in', 'iitm.ac.in', 'iitkgp.ac.in',
  'iitk.ac.in', 'iitbbs.ac.in', 'iith.ac.in', 'iitr.ac.in',
  'iitg.ac.in', 'iiti.ac.in', 'iisc.ac.in', 'bits-pilani.ac.in',
  // Canada
  'utoronto.ca', 'ubc.ca', 'mcgill.ca', 'ualberta.ca', 'uwaterloo.ca',
  'queensu.ca', 'uwo.ca', 'dal.ca', 'usask.ca', 'umanitoba.ca',
  'sfu.ca', 'yorku.ca', 'carleton.ca', 'uottawa.ca', 'concordia.ca',
  'umontreal.ca', 'polymtl.ca', 'mcmaster.ca', 'guelph.ca',
  'uvic.ca', 'unb.ca', 'mun.ca', 'uleth.ca', 'uregina.ca',
  // Australia (in addition to .edu.au)
  'sydney.edu.au', 'unimelb.edu.au', 'anu.edu.au', 'uq.edu.au',
  'unsw.edu.au', 'monash.edu', 'uwa.edu.au', 'adelaide.edu.au',
  'uts.edu.au', 'rmit.edu.au', 'latrobe.edu.au', 'deakin.edu.au',
  'curtin.edu.au', 'griffith.edu.au', 'jcu.edu.au', 'newcastle.edu.au',
  'wollongong.edu.au', 'flinders.edu.au', 'bond.edu.au', 'cqu.edu.au',
]

export const isUniversityEmail = (email) => {
  const lower = email.toLowerCase()
  if (ACADEMIC_TLDS.some(tld => lower.endsWith(tld))) return true
  const domain = lower.split('@')[1]
  if (!domain) return false
  if (UNIVERSITY_DOMAIN_WHITELIST.some(d => domain === d || domain.endsWith('.' + d))) return true
  return false
}