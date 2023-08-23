import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { PlaceInfoType } from "../../types/types";

const { kakao }: any = window;

interface Props {
  placeInfo: PlaceInfoType;
}

const ReadMap = ({ placeInfo }: Props) => {
  // const infowindowArrowInput = useRef<HTMLInputElement>(null);
  // const [mapLocation, setMapLocation] = useState({});

  useEffect(() => {
    const mapContainer = document.getElementById("map"); // 지도를 표시할 div
    const mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);
    // 주소-좌표 변환 객체를 생성합니다
    const geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(
      `${placeInfo?.placeAddr}`,
      function (result: any, status: any) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          // setMapLocation([coords["Ma"], coords["La"]]);

          // 결과값으로 받은 위치를 마커로 표시합니다
          const marker = new kakao.maps.Marker({
            map: map,
            position: coords,
          });

          // 인포윈도우로 장소에 대한 설명을 표시합니다
          const infowindow = new kakao.maps.InfoWindow({
            content: `<div class="infowindowArrow"></div><div class="infowindow"><span class="placename">${placeInfo?.placeName}</span><span class="placeaddr">${placeInfo?.placeAddr}</span></div>`,
          });
          const infowindowArrow = infowindow.a.childNodes[0];
          console.log("infowindowArrow", infowindowArrow);
          infowindow.open(map, marker);

          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords);
          marker.setMap(map);
        }
      }
    );
  }, [placeInfo]);

  return (
    <Container>
      {/* <PlaceText>
        <PlaceName>{placeInfo?.placeName}</PlaceName>
      </PlaceText> */}
      <Map>
        <div id="map"></div>
      </Map>
    </Container>
  );
};

export default ReadMap;

const Container = styled.section`
  padding: 0 4rem 1.25rem 4rem;
  margin-bottom: 2rem;
`;

const Map = styled.div`
  #map {
    width: 100%;
    height: 16.3rem;

    /* .infowindowArrow {
      position: absolute;
      width: 11px;
      height: 9px;
      background: url("http: ; //t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/triangle.png")
        0% 0% / 20px 20px no-repeat;
      left: 94px;
      top: 56px;
      background-color: white;
    } */

    .infowindow {
      width: 13rem;
      padding: 0.7rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      font-size: 0.9rem;
      font-weight: 400;
    }
    .placename {
      margin-bottom: 0.15rem;
    }
    .placeaddr {
      color: #767676;
    }
  }
`;
