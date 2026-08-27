

function MyButton() {
    //전역변수로 이미 존재하는 React 객체 useState를 꺼내서 사용한다
    const [isClicked, setIsClicked] = React.useState(false);
    //button 요소를 반환하는데 버튼이 클릭되었을 때 isClicked 상태의 값을 변경한다.
    //button 요소 사이의 텍스트가 변경된다.(true면 clicked로 false면 click here로 변경된다)
    return React.createElement(
        'button',
        {
            onClick: () => setIsClicked(!isClicked)
        },
        isClicked ? 'Cilicked' : 'Click here'
    );

}
//index.html에 있는 <div id="root"></div>요소 객체를 반환받아서 domContainer 변수에 대입
const domContainer = document.querySelector('#root');

//ReactDom 객체에 루트요소객체를 생성
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(MyButton));
