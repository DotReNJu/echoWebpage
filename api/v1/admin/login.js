// const app = express.Router();
const jkh = require("../function/jkh_function")
const { Q, pool } = require('../../../db/psqldb');
const passport = require('../function/jkh_passportU');
/*
 const index = async (req, res) => {
  const response = {
    state: 1, // 상태표시 0: 실패, 1: 성공, 2변수없음, 3조회결과없음
    query: null, // 응답 값(JSON 형식) null, Object, Array, Boolean 중 하나
    msg: 'Successful',
  };
  */
const index = async (req, res) => {
   //쿠키에 담아줘야될것
    // 닉네임
    // id
    // jwt
    // 에러처리
   if (req.user.error) {
     return res.status(500).json(req.user);
   }
  
   // 로그인 성공 시
const { token } = req;
res.send(`token :   ${token}`);
  return res.json({ token });
}//login 
const del_log = async (req,res) =>{
  const response = {
    state: 1, // 상태표시 0: 실패, 1: 성공, 2: 변수없음, 3: 조회결과없음
    query: null, // 응답 값(JSON 형식) null, Object, Array, Boolean 중 하나
    msg: 'Successful',
  };
  const params = {  //모든 파일에서 중요함 => req에서 받아서 사용
    ...req.query,
    ...req.params,
    ...req.body,
    id: req.uesr.email,
    pw: req.user.password
  }
  //var session = req.session; //새선 만듬
  var pw_c = jkh.cipher(params.pw);
    try {
    const sql1 = Q`
        SELECT 
          u.username,
          ul.level_u
        FROM
          users u, users_level ul
        WHERE        
          ul.level_u in (select level_u form users_level ul2, users u2 WHERE u2.user_id = ul2.user_id)
          AND
          u.email = ${params.id}
          AND
          u.pw = ${params.pw}
        `;//
    const query1 = await pool.query(sql1);//조회 알고리즘
    if (jkh.isEmpty(query1.rows)) {
      response.state = 2;
      response.msg = 'login failed';
      jkh.webhook('err', response.msg)//log 보내는 역활
      return res.state(404).send(json(response));
    }
    else {
      const user_id = query1.rows[0].user_id;//사용자 key 추출
      session.user = {
        name: response.query,//results[0].user_name;//results[0];
        password: req_data.pw,
        email: req_data.email
      }//새션생성
      res.cookie('auth',true);//쿠키생성 추후 수정예정
      response.state = 1; 
      response.msg = 'login Success';
      jkh.webhook('Success', response.msg)//log 보내는 역활 -> 디스코드
    }
    //const sql2 = Q`
    //    insert into login_log(user_id,log_time) values (${user_id},${jkh.date_time()})
    //    `;
    //const query2 = await pool.query(sql2);

  }
  catch (err) {
    console.error(err);
    jkh.webhook.sendMessage('err','login sql select err(500)')//log 보내는 역활
  }
  return res.state(200).join(response);//데이터 전송 !!
}//login 
//const del_logi = async (req,res) =>{}

const test = (req, res)=>{ //테스트 함수
  const user_id = req.body.user_id;
  return res.send(user_id + "로그인 성공");
}

module.exports = (app) => {
  app.group([],(router)=>{
    router.post('/in',[passport.authenticate('user.local', { session: false })],index),//로그인
    router.post('/in/naver',[passport.authenticate('user.naver', { session: false })],index),//로그인
    router.post('/in/kakao',[passport.authenticate('user.kakao', { session: false })],index),//로그인
    router.post('/out',del_log),//로그아웃
    router.get('/test',test)//테스트
    });
}