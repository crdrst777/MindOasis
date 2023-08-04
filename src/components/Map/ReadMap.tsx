import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { PlaceInfoType } from "../../types/types";

const { kakao }: any = window;

interface Props {
  placeInfo: PlaceInfoType;
}

const ReadMap = ({ placeInfo }: Props) => {
  const [mapLocation, setMapLocation] = useState({});

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
          setMapLocation([coords["Ma"], coords["La"]]);

          // 결과값으로 받은 위치를 마커로 표시합니다
          const marker = new kakao.maps.Marker({
            map: map,
            position: coords,
          });

          // 인포윈도우로 장소에 대한 설명을 표시합니다
          const infowindow = new kakao.maps.InfoWindow({
            content: `<div class="infowindow"><span>${placeInfo?.placeName}</span><span>${placeInfo?.placeAddr}</span></div>`,
          });
          infowindow.open(map, marker);

          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords);
          marker.setMap(map);
        }
      }
    );
  }, [placeInfo]);

  console.log(placeInfo);

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

const PlaceText = styled.div`
  display: flex;
  justify-content: end;
  font-weight: 400;
  margin: 0 0 0.8rem 0;
`;
const PlaceName = styled.span`
  color: ${(props) => props.theme.colors.darkGray};
`;
// const PlaceAddr = styled.span`
//   color: ${(props) => props.theme.colors.blue};
// `;

const Map = styled.div`
  #map {
    width: 100%;
    height: 16rem;

    .infowindow {
      width: 13.75rem;
      padding: 0.6rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      font-weight: 400;

      span {
        padding: 0.1rem 0;
      }
    }
  }
`;
