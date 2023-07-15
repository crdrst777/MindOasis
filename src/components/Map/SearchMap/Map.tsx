import { useEffect, useState } from "react";
import { styled } from "styled-components";

const { kakao }: any = window;

interface SearchMapProps {
  searchPlace: string;
}

const SearchMap = ({ searchPlace }: SearchMapProps) => {
  const [mapLocation, setMapLocation] = useState({});
  const [mapData, setMapData] = useState([33.450701, 126.570667]);
  // const [address, setAddress] = useState("제주특별자치도 제주시 첨단로 242");

  // useEffect(() => {
  //   const container = document.getElementById("map"); // 지도를 표시할 div
  //   const options = {
  //     center: new kakao.maps.LatLng(mapData[0], mapData[1]), // 지도의 중심좌표
  //     level: 3, // 지도의 확대 레벨
  //   };
  //   const map = new kakao.maps.Map(container, options); // 지도를 생성합니다
  //   console.log("loading kakaomap");

  //   // const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
  //   // const marker = new kakao.maps.Marker(); // 클릭한 위치를 표시할 마커
  //   // const infowindow = new kakao.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우

  //   const markerPosition = new kakao.maps.LatLng(mapData[0], mapData[1]);
  //   // 마커를 생성합니다
  //   const Firstmarker = new kakao.maps.Marker({
  //     position: markerPosition,
  //   });
  //   // 마커가 지도 위에 표시되도록 설정합니다
  //   Firstmarker.setMap(map);
  // }, [searchPlace, setMapLocation, mapData]);

  useEffect(() => {
    const mapContainer = document.getElementById("map"); // 지도를 표시할 div
    const mapOption = {
      center: new kakao.maps.LatLng(mapData[0], mapData[1]), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);
    // 주소-좌표 변환 객체를 생성합니다
    const geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(
      `${searchPlace}`,
      function (result: any, status: any) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          console.log("coords", coords);
          setMapLocation([coords["Ma"], coords["La"]]);

          // 결과값으로 받은 위치를 마커로 표시합니다
          const marker = new kakao.maps.Marker({
            map: map,
            position: coords,
          });
          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords);
          marker.setMap(map);

          kakao.maps.event.addListener(
            map,
            "click",
            function (mouseEvent: any) {
              // 클릭한 위도, 경도 정보를 가져옵니다
              const latlng = mouseEvent.latLng;

              // 마커 위치를 클릭한 위치로 옮깁니다
              marker.setPosition(latlng);
              let message =
                "클릭한 위치의 위도는 " + latlng.getLat() + " 이고, ";
              message += "경도는 " + latlng.getLng() + " 입니다";
              console.log(message);

              setMapLocation([latlng.getLat(), latlng.getLng()]);
            }
          );
          // // 결과값으로 받은 위치를 마커로 표시합니다
          // const marker = new kakao.maps.Marker({
          //   map: map,
          //   position: coords,
          // });
          // // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          // map.setCenter(coords);
          // marker.setMap(map);
        }
      }
    );
  }, [searchPlace]);

  //
  // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 하는 함수
  // const searchDetailAddrFromCoords = (
  //   e: React.MouseEvent<HTMLDivElement>
  // ) => {
  //   // const coord = new kakao.maps.LatLng(37.5566803113882, 126.904501286522); // 주소로 변환할 좌표 입력
  //   const callback = function (result: any, status: any) {
  //     if (status === kakao.maps.services.Status.OK) {
  //       console.log("result");
  //       console.log(result[0].address);

  //       // 마커를 클릭한 위치에 표시합니다
  //       const latlng = mouseEvent.latLng;
  //       marker.setPosition(latlng);
  //       marker.setMap(map);
  //     }
  //   };
  // };

  // const markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);
  // // 마커를 생성합니다
  // const marker = new kakao.maps.Marker({
  //   position: markerPosition,
  // });
  // // 마커가 지도 위에 표시되도록 설정합니다
  // marker.setMap(map);

  return (
    <Map>
      <div id="map"></div>
    </Map>
  );
};

export default SearchMap;

const Map = styled.div`
  #map {
    width: 40rem;
    height: 20rem;
  }
`;
